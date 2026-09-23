import { matchLocation } from "../locations";
import { detectRideType, type RideType } from "../rideType";
import { findStaticRoute } from "./staticRoutes";
import { estimateFallback, estimateDistanceDuration } from "./fallback";
import { vehicleSurchargeFor, type VehicleType } from "./vehicle";

export type QuoteInput = {
  pickup: string;
  destination: string;
  vehicleType: VehicleType;
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
};

/**
 * The one place that turns a booking wizard's inputs into the number
 * shown to the customer: basisprijs/routeprijs + toeslagen +
 * voertuigtoeslag = vaste totaalprijs (the client's own formula). Kept
 * deliberately free of any UI or persistence concerns so it's easy to
 * unit test and easy to swap for a Google-Maps-backed version in Phase 2
 * without touching the booking wizard or the API route that calls this.
 */
export function calculateQuote(input: QuoteInput): Quote {
  const rideType = detectRideType(input.pickup, input.destination);
  const origin = matchLocation(input.pickup);
  const destination = matchLocation(input.destination);

  const staticRoute =
    origin && destination ? findStaticRoute(origin.id, destination.id) : undefined;

  // Price and distance/duration are deliberately sourced independently:
  // a curated fixed price (staticRoutes.ts) says nothing about distance,
  // so distance/duration always come from the one shared estimator
  // (see the comment on estimateDistanceDuration) whether or not the
  // price itself was a static lookup or the fallback formula.
  const { distanceKm, durationMin } = estimateDistanceDuration(origin, destination);
  const basePrice = staticRoute
    ? staticRoute.basePrice
    : estimateFallback(distanceKm, rideType);

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
