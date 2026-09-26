import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { googlePlacesProvider } from "./googleProvider";
import { PlacesNotConfiguredError } from "./types";

const ORIGINAL_KEY = process.env.GOOGLE_MAPS_API_KEY;

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
}

describe("googlePlacesProvider", () => {
  beforeEach(() => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env.GOOGLE_MAPS_API_KEY = ORIGINAL_KEY;
    vi.restoreAllMocks();
  });

  it("throws PlacesNotConfiguredError when no API key is set, without calling fetch", async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(googlePlacesProvider.autocomplete("Dam", "session-1", "nl")).rejects.toBeInstanceOf(
      PlacesNotConfiguredError
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends the session token, NL region restriction, and language on autocomplete, and parses suggestions", async () => {
    const fetchMock = mockFetchOnce({
      suggestions: [
        {
          placePrediction: {
            placeId: "abc123",
            text: { text: "Dam, Amsterdam, Nederland" },
            structuredFormat: {
              mainText: { text: "Dam" },
              secondaryText: { text: "Amsterdam, Nederland" },
            },
          },
        },
      ],
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await googlePlacesProvider.autocomplete("Dam", "session-1", "nl");

    expect(result).toEqual([
      { id: "abc123", primaryText: "Dam", secondaryText: "Amsterdam, Nederland" },
    ]);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("places:autocomplete");
    const body = JSON.parse(options.body);
    expect(body.sessionToken).toBe("session-1");
    expect(body.includedRegionCodes).toEqual(["nl"]);
    expect(body.languageCode).toBe("nl");
    expect(options.headers["X-Goog-Api-Key"]).toBe("test-key");
  });

  it("returns an empty array when Google returns no suggestions", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({}));
    const result = await googlePlacesProvider.autocomplete("zzzzz", "session-1", "nl");
    expect(result).toEqual([]);
  });

  it("throws on a non-ok autocomplete response instead of silently returning []", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({ error: "bad request" }, false, 400));
    await expect(googlePlacesProvider.autocomplete("Dam", "session-1", "nl")).rejects.toThrow();
  });

  it("resolves place details with the session token and field mask", async () => {
    const fetchMock = mockFetchOnce({
      id: "abc123",
      formattedAddress: "Dam 1, 1012 Amsterdam, Nederland",
      location: { latitude: 52.3731, longitude: 4.8926 },
      types: ["street_address"],
      addressComponents: [{ types: ["street_number"] }, { types: ["route"] }],
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await googlePlacesProvider.getDetails("abc123", "session-1");

    expect(result).toEqual({
      placeId: "abc123",
      formattedAddress: "Dam 1, 1012 Amsterdam, Nederland",
      lat: 52.3731,
      lng: 4.8926,
      missingHouseNumber: false,
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("places/abc123");
    expect(url).toContain("sessionToken=session-1");
    expect(options.headers["X-Goog-FieldMask"]).toBe(
      "id,formattedAddress,location,types,addressComponents"
    );
  });

  it("flags missingHouseNumber for a bare street (Google type 'route') with no street_number component", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchOnce({
        id: "abc123",
        formattedAddress: "Damrak, Amsterdam, Nederland",
        location: { latitude: 52.3765, longitude: 4.8977 },
        types: ["route"],
        addressComponents: [{ types: ["route"] }],
      })
    );

    const result = await googlePlacesProvider.getDetails("abc123", "session-1");
    expect(result.missingHouseNumber).toBe(true);
  });

  it("does not flag a named place (e.g. an airport) even though it has no street_number", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetchOnce({
        id: "schiphol",
        formattedAddress: "Schiphol, 1118 Schiphol, Nederland",
        location: { latitude: 52.3105, longitude: 4.7683 },
        types: ["airport", "point_of_interest", "establishment"],
        addressComponents: [],
      })
    );

    const result = await googlePlacesProvider.getDetails("schiphol", "session-1");
    expect(result.missingHouseNumber).toBe(false);
  });

  it("throws when the details response is missing coordinates", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({ id: "abc123", formattedAddress: "Somewhere" }));
    await expect(googlePlacesProvider.getDetails("abc123", "session-1")).rejects.toThrow();
  });
});
