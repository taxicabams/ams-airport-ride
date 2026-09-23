import type { Location } from "../locations";
import type { RideType } from "../rideType";

/**
 * Transparent fallback formula for any pickup/destination pair that
 * isn't one of the curated Schiphol routes (staticRoutes.ts) — most
 * plain NL city-to-city rides land here. Inspired by Taxi Falcon's
 * "one simple rule, no hidden surcharges" pricing (see the plan's
 * competitor research), tuned to a mid-market rate and with an explicit
 * airport surcharge component, since researched competitors bake
 * Schiphol parking/access fees into their airport prices.
 */
export const BASE_FEE_EUR = 8;
export const RATE_PER_KM_EUR = 1.6;
export const AIRPORT_SURCHARGE_EUR = 6;
export const MINIMUM_PRICE_EUR = 25;

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

export function estimateFallback(
  origin: Location | undefined,
  destination: Location | undefined,
  rideType: RideType
): { basePrice: number; distanceKm: number; durationMin: number } {
  const distanceKm =
    origin && destination
      ? Math.round(haversineKm(origin, destination) * ROAD_DISTANCE_FACTOR)
      : UNKNOWN_LOCATION_ASSUMED_KM;

  const durationMin = Math.max(15, Math.round(distanceKm * 1.2));

  const airportSurcharge = rideType === "AIRPORT_TRANSFER" ? AIRPORT_SURCHARGE_EUR : 0;
  const raw = BASE_FEE_EUR + distanceKm * RATE_PER_KM_EUR + airportSurcharge;

  return {
    basePrice: Math.max(MINIMUM_PRICE_EUR, Math.round(raw)),
    distanceKm,
    durationMin,
  };
}
