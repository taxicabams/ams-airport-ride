import { matchLocation } from "../locations";
import { detectRideType, type RideType } from "../rideType";
import { findStaticRoute } from "./staticRoutes";
import { estimateFallback, estimateDistanceDuration } from "./fallback";
import { vehicleSurchargeFor, type VehicleType } from "./vehicle";

export type QuoteInput = {
  pickup: string;
  destination: string;
  vehicleType: VehicleType;
  /**
   * Real distance/duration from Google Routes (Phase 2B), when we have
   * resolved coordinates for both sides — see /api/quote. Optional and
   * additive: every existing caller that only has free-text addresses
   * keeps working exactly as before, falling back to the haversine
   * estimate. Curated fixed prices (staticRoutes.ts) never change
   * because of this — only the *displayed* distance/duration and the
   * *fallback formula's* input distance benefit from the real number.
   */
  routeOverride?: { distanceKm: number; durationMin: number };
};

export type Surcharge = { label: string; amount: number };

export type Quote = {
  rideType: RideType;
  basePrice: number;
  surcharges: Surcharge[];
  vehicleSurcharge: number;
  totalPrice: number;
  distanceKm: number;
  durationMin: number;
  /** "fixed" = matched one of our curated Schiphol routes, "estimate" = fallback formula. */
  source: "fixed" | "estimate";
  /** Where distanceKm/durationMin came from — independent of `source` (price). */
  distanceSource: "google" | "estimate";
};

/**
 * The one place that turns a booking wizard's inputs into the number
 * shown to the customer: basisprijs/routeprijs + toeslagen +
 * voertuigtoeslag = vaste totaalprijs (the client's own formula). Kept
 * deliberately free of any UI or persistence concerns so it's easy to
 * unit test — it never calls Google itself; the caller (an API route)
 * resolves a real route first and passes it in as `routeOverride`.
 */
export function calculateQuote(input: QuoteInput): Quote {
  const rideType = detectRideType(input.pickup, input.destination);
  const origin = matchLocation(input.pickup);
  const destination = matchLocation(input.destination);

  const staticRoute =
    origin && destination ? findStaticRoute(origin.id, destination.id) : undefined;

  // Price and distance/duration are deliberately sourced independently:
  // a curated fixed price (staticRoutes.ts) says nothing about distance,
  // so distance/duration always come from the best available estimator
  // — real Google Routes data when the caller has it, otherwise the
  // haversine fallback (see estimateDistanceDuration) — whether or not
  // the price itself was a static lookup or the fallback formula.
  const { distanceKm, durationMin } =
    input.routeOverride ?? estimateDistanceDuration(origin, destination);

  const basePriceBeforeFarSurcharge = staticRoute
    ? staticRoute.basePrice
    : estimateFallback(distanceKm, rideType, durationMin);

  // Real pricing gap found live: a genuine customer booking (Schiphol →
  // Zeist, 52km) priced at a curated €85 made the client look at the
  // whole far-route price list and conclude it was too cheap for that
  // kind of distance. Explicit instruction: every ride 30km+ gets a
  // clean +20% on top — applied uniformly to BOTH a curated Schiphol
  // price and the per-km formula (private rides included), never just
  // one pricing path, so the rule can't quietly stop applying once a
  // route falls out of the curated list. Rounded to the nearest €5
  // ("mooie prijzen" — a clean number a customer reads as a deliberate
  // price, not a stray formula result like €102).
  //
  // Explicit exception, named directly by the client: Utrecht,
  // Rotterdam and Den Haag stay at their normal (un-surcharged) price —
  // these are the 3 big cities with real competition (train, other
  // taxi firms), where he wants to stay competitively priced rather
  // than add the convenience surcharge that makes sense for smaller/
  // less-served far destinations like Zeist or Dordrecht.
  const FAR_ROUTE_THRESHOLD_KM = 30;
  const FAR_ROUTE_SURCHARGE_MULTIPLIER = 1.2;
  const FAR_ROUTE_SURCHARGE_EXEMPT_IDS = ["utrecht", "rotterdam", "den-haag"];
  const isSurchargeExempt =
    (origin && FAR_ROUTE_SURCHARGE_EXEMPT_IDS.includes(origin.id)) ||
    (destination && FAR_ROUTE_SURCHARGE_EXEMPT_IDS.includes(destination.id));
  const basePrice =
    distanceKm > FAR_ROUTE_THRESHOLD_KM && !isSurchargeExempt
      ? Math.round((basePriceBeforeFarSurcharge * FAR_ROUTE_SURCHARGE_MULTIPLIER) / 5) * 5
      : basePriceBeforeFarSurcharge;

  // v1 has no time-of-day/day-of-week surcharges (deliberately, per the
  // client's spec) — the array exists so one can be added later without
  // changing the Quote shape or any caller.
  const surcharges: Surcharge[] = [];

  const vehicleSurcharge = vehicleSurchargeFor(input.vehicleType);
  const totalPrice =
    basePrice + surcharges.reduce((sum, s) => sum + s.amount, 0) + vehicleSurcharge;

  return {
    rideType,
    basePrice,
    surcharges,
    vehicleSurcharge,
    totalPrice,
    distanceKm,
    durationMin,
    source: staticRoute ? "fixed" : "estimate",
    distanceSource: input.routeOverride ? "google" : "estimate",
  };
}

export type { VehicleType } from "./vehicle";
export {
  BUS_SURCHARGE_EUR,
  PERSONENAUTO_MAX_PASSENGERS,
  PERSONENAUTO_MAX_LUGGAGE,
  BUS_MAX_PASSENGERS,
  BUS_MAX_LUGGAGE,
  recommendedVehicle,
} from "./vehicle";
export { CHEAPEST_SCHIPHOL_PRICE } from "./staticRoutes";
