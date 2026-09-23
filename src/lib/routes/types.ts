/**
 * Provider-agnostic route/distance types — mirrors lib/places' shape
 * for the same reason: callers only ever import from ./index, so
 * swapping Google Routes for another provider later is one new file
 * plus a one-line change there.
 */
export type LatLng = { lat: number; lng: number };

export type RouteResult = {
  distanceKm: number;
  durationMin: number;
};

export interface RoutesProvider {
  computeRoute(origin: LatLng, destination: LatLng): Promise<RouteResult>;
}

/** Thrown when the provider can't run at all (e.g. no API key configured). */
export class RoutesNotConfiguredError extends Error {
  constructor(message = "Routes provider is not configured") {
    super(message);
    this.name = "RoutesNotConfiguredError";
  }
}
