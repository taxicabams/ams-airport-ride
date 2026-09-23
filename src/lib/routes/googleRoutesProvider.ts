import "server-only";
import type { LatLng, RoutesProvider, RouteResult } from "./types";
import { RoutesNotConfiguredError } from "./types";

// Same GCP project/key as Places (see the plan) — scoped via API
// restriction in Google Cloud Console, not a second key.
const COMPUTE_ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

type GoogleRoutesResponse = {
  routes?: { distanceMeters?: number; duration?: string }[];
};

function apiKey(): string {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new RoutesNotConfiguredError();
  return key;
}

async function computeRoute(origin: LatLng, destination: LatLng): Promise<RouteResult> {
  const res = await fetch(COMPUTE_ROUTES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey(),
      // Routes API (like Places API New) bills/limits by requested
      // fields — ask for exactly what the pricing engine needs.
      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
    },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      units: "METRIC",
    }),
  });

  if (!res.ok) {
    throw new Error(`Routes computeRoutes failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as GoogleRoutesResponse;
  const route = data.routes?.[0];

  if (route?.distanceMeters == null || !route.duration) {
    throw new Error("Routes response missing distance/duration");
  }

  // "1234s" -> 1234
  const durationSeconds = Number.parseInt(route.duration.replace(/s$/, ""), 10);
  if (!Number.isFinite(durationSeconds)) {
    throw new Error(`Unexpected duration format: ${route.duration}`);
  }

  return {
    distanceKm: Math.round((route.distanceMeters / 1000) * 10) / 10,
    durationMin: Math.round(durationSeconds / 60),
  };
}

export const googleRoutesProvider: RoutesProvider = { computeRoute };
