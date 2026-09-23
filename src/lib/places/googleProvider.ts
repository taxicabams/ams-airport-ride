import "server-only";
import type { PlacesProvider, PlaceSuggestion, ResolvedPlace } from "./types";
import { PlacesNotConfiguredError } from "./types";

// `server-only` makes it a build-time error to ever import this file
// from client code — the API key must never end up in a browser bundle.

const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";
const DETAILS_URL = "https://places.googleapis.com/v1/places";

// Minimal shapes for the parts of Google's response we actually read —
// not a full type of the API, on purpose (less to keep in sync).
type GoogleAutocompleteResponse = {
  suggestions?: {
    placePrediction?: {
      placeId?: string;
      text?: { text?: string };
      structuredFormat?: {
        mainText?: { text?: string };
        secondaryText?: { text?: string };
      };
    };
  }[];
};

type GoogleDetailsResponse = {
  id?: string;
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
};

function apiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new PlacesNotConfiguredError();
  return key;
}

async function autocomplete(
  input: string,
  sessionToken: string,
  languageCode: string
): Promise<PlaceSuggestion[]> {
  const res = await fetch(AUTOCOMPLETE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
    },
    body: JSON.stringify({
      input,
      sessionToken,
      languageCode,
      // Restrict to NL addresses/places — the brief's Schiphol/hotel/
      // station cases are all "establishment"/"geocode" results Google
      // already surfaces without a narrower type filter.
      includedRegionCodes: ["nl"],
    }),
  });

  if (!res.ok) {
    throw new Error(`Places autocomplete failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as GoogleAutocompleteResponse;

  return (data.suggestions ?? [])
    .map((s) => s.placePrediction)
    .filter((p): p is NonNullable<typeof p> => Boolean(p?.placeId))
    .map((p) => ({
      id: p.placeId!,
      primaryText: p.structuredFormat?.mainText?.text ?? p.text?.text ?? "",
      secondaryText: p.structuredFormat?.secondaryText?.text ?? "",
    }));
}

async function getDetails(placeId: string, sessionToken: string): Promise<ResolvedPlace> {
  const url = `${DETAILS_URL}/${encodeURIComponent(placeId)}?sessionToken=${encodeURIComponent(sessionToken)}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey(),
      // Places API (New) bills by which fields you request — keep this
      // to exactly what we use.
      "X-Goog-FieldMask": "id,formattedAddress,location",
    },
  });

  if (!res.ok) {
    throw new Error(`Places details failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as GoogleDetailsResponse;

  if (!data.formattedAddress || data.location?.latitude == null || data.location?.longitude == null) {
    throw new Error("Places details response missing required fields");
  }

  return {
    placeId: data.id ?? placeId,
    formattedAddress: data.formattedAddress,
    lat: data.location.latitude,
    lng: data.location.longitude,
  };
}

export const googlePlacesProvider: PlacesProvider = { autocomplete, getDetails };
