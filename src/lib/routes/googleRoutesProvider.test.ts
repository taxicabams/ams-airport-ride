import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { googleRoutesProvider } from "./googleRoutesProvider";
import { RoutesNotConfiguredError } from "./types";

const ORIGINAL_KEY = process.env.GOOGLE_MAPS_API_KEY;

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  });
}

const SCHIPHOL = { lat: 52.3105, lng: 4.7683 };
const AMSTERDAM_DAM = { lat: 52.3731, lng: 4.8926 };

describe("googleRoutesProvider", () => {
  beforeEach(() => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env.GOOGLE_MAPS_API_KEY = ORIGINAL_KEY;
    vi.restoreAllMocks();
  });

  it("throws RoutesNotConfiguredError when no API key is set, without calling fetch", async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    await expect(googleRoutesProvider.computeRoute(SCHIPHOL, AMSTERDAM_DAM)).rejects.toBeInstanceOf(
      RoutesNotConfiguredError
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends lat/lng, DRIVE mode, and a minimal field mask, and parses distance/duration", async () => {
    const fetchMock = mockFetchOnce({
      routes: [{ distanceMeters: 18400, duration: "1380s" }],
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await googleRoutesProvider.computeRoute(SCHIPHOL, AMSTERDAM_DAM);

    expect(result).toEqual({ distanceKm: 18.4, durationMin: 23 });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("computeRoutes");
    expect(options.headers["X-Goog-Api-Key"]).toBe("test-key");
    expect(options.headers["X-Goog-FieldMask"]).toBe("routes.duration,routes.distanceMeters");

    const body = JSON.parse(options.body);
    expect(body.origin.location.latLng).toEqual({ latitude: SCHIPHOL.lat, longitude: SCHIPHOL.lng });
    expect(body.destination.location.latLng).toEqual({
      latitude: AMSTERDAM_DAM.lat,
      longitude: AMSTERDAM_DAM.lng,
    });
    expect(body.travelMode).toBe("DRIVE");
  });

  it("throws on a non-ok response instead of silently returning a default", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({ error: "bad request" }, false, 400));
    await expect(googleRoutesProvider.computeRoute(SCHIPHOL, AMSTERDAM_DAM)).rejects.toThrow();
  });

  it("throws when the response has no routes", async () => {
    vi.stubGlobal("fetch", mockFetchOnce({ routes: [] }));
    await expect(googleRoutesProvider.computeRoute(SCHIPHOL, AMSTERDAM_DAM)).rejects.toThrow();
  });
});
