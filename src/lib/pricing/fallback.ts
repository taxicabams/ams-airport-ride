import type { Location } from "../locations";
import type { RideType } from "../rideType";

/**
 * Fallback formula for the airport-transfer case specifically: a
 * pickup/destination pair that involves Schiphol but isn't one of the
 * curated fixed routes (staticRoutes.ts). Inspired by Taxi Falcon's "one
 * simple rule, no hidden surcharges" pricing (see the plan's competitor
 * research), tuned to a mid-market rate and with an explicit airport
 * surcharge component, since researched competitors bake Schiphol
 * parking/access fees into their airport prices. Every other ride (not
 * touching Schiphol at all) uses PRIVATE_RIDE_RATE_PER_KM_EUR instead —
 * see estimateFallback below.
 */
export const BASE_FEE_EUR = 8;
export const RATE_PER_KM_EUR = 1.6;
export const AIRPORT_SURCHARGE_EUR = 6;
export const MINIMUM_PRICE_EUR = 25;

/**
 * Client's explicit rate for any ride that doesn't touch Schiphol at
 * all: a plain per-km price for the Personenauto, no base fee — the Bus
 * surcharge (vehicle.ts's BUS_SURCHARGE_EUR) still applies on top, same
 * as everywhere else. Schiphol rides never use this — they keep the
 * curated fixed prices (staticRoutes.ts) or, if genuinely unmatched, the
 * existing airport fallback formula above, both unchanged.
 */
export const PRIVATE_RIDE_RATE_PER_KM_EUR = 2.5;

/** Straight-line distance, inflated a bit to approximate real road routes. */
const ROAD_DISTANCE_FACTOR = 1.3;

function haversineKm(a: Location, b: Location): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

/**
 * Distance used when neither pickup nor destination matched a known
 * location (v1 has no geocoding yet — see the plan's Phase 2 note about
 * Google Distance Matrix). A conservative mid-range assumption so we can
 * still honor "always show one confident price," clearly commented as a
 * known v1 limitation rather than a real measurement.
 */
const UNKNOWN_LOCATION_ASSUMED_KM = 25;

/**
 * Distance/duration estimation, shared by every pricing path — not just
 * this fallback formula. Even when a route has a curated fixed PRICE
 * (staticRoutes.ts), its displayed distance/duration still comes from
 * here, so there's exactly one estimation method in the codebase rather
 * than duplicated numbers that could disagree.
 */
export function estimateDistanceDuration(
  origin: Location | undefined,
  destination: Location | undefined
): { distanceKm: number; durationMin: number } {
  const distanceKm =
    origin && destination
      ? Math.round(haversineKm(origin, destination) * ROAD_DISTANCE_FACTOR)
      : UNKNOWN_LOCATION_ASSUMED_KM;

  const durationMin = Math.max(15, Math.round(distanceKm * 1.2));

  return { distanceKm, durationMin };
}

/**
 * @param distanceKm Pass the already-computed value from
 * `estimateDistanceDuration` (calculateQuote does this for every route,
 * static-priced or not) rather than recomputing it here.
 *
 * Two entirely separate formulas, picked by ride type: a private ride
 * (not touching Schiphol) is a flat €/km rate per the client's own
 * instruction, with the same minimum floor as before so a very short
 * hop doesn't undercut a realistic minimum fare. An airport transfer
 * only ever reaches this function when it *isn't* one of the curated
 * fixed routes (staticRoutes.ts) — that fallback formula is untouched,
 * exactly as it was before this ride-type split existed.
 */
export function estimateFallback(distanceKm: number, rideType: RideType): number {
  if (rideType === "PRIVATE_RIDE") {
    const raw = distanceKm * PRIVATE_RIDE_RATE_PER_KM_EUR;
    return Math.max(MINIMUM_PRICE_EUR, Math.round(raw));
  }

  const raw = BASE_FEE_EUR + distanceKm * RATE_PER_KM_EUR + AIRPORT_SURCHARGE_EUR;
  return Math.max(MINIMUM_PRICE_EUR, Math.round(raw));
}
