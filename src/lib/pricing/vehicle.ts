export type VehicleType = "PERSONENAUTO" | "BUS";

/**
 * Deliberately simple, per the client's spec: exactly two vehicle
 * options, no Economy/Business/Premium tiers. The bus surcharge is one
 * named constant so it's a one-line change later, never scattered
 * inline math.
 */
export const BUS_SURCHARGE_EUR = 15;

/**
 * Flat stopover surcharge — one extra address the driver stops at along
 * the way (client request: "doe ook tussenstop maar bedenk hoe ik dat
 * kan fiksen in me prijs"). A flat add-on, not a real per-route distance
 * recalculation: the app has no live multi-waypoint routing integration
 * (Google Routes is only ever called with one origin/destination pair —
 * see /api/quote), so pretending to compute the exact extra km for an
 * arbitrary stopover would mean inventing a number, not calculating one.
 * A flat, always-the-same, told-upfront surcharge keeps the site's
 * "vaste prijs vooraf" promise honest for this case too — same pattern
 * as BUS_SURCHARGE_EUR above.
 *
 * ⚠️ NOT YET CLIENT-APPROVED — same status as SCHIPHOL_PRICES: a
 * reasonable starting number, not a confirmed final price. Flag this
 * file if this number is discussed before the client has signed off.
 */
export const STOPOVER_SURCHARGE_EUR = 10;

/**
 * Capacity configuration — every number the booking flow's capacity
 * logic depends on lives here, so retuning it later (e.g. once the
 * client confirms real vehicle specs) is a one-file edit.
 */
export const PERSONENAUTO_MAX_PASSENGERS = 4;
export const PERSONENAUTO_MAX_LUGGAGE = 4;
/** Absolute ceiling for v1 — only two vehicles exist, Bus is the biggest. */
export const BUS_MAX_PASSENGERS = 7;
export const BUS_MAX_LUGGAGE = 8;

export function vehicleSurchargeFor(vehicleType: VehicleType): number {
  return vehicleType === "BUS" ? BUS_SURCHARGE_EUR : 0;
}

/**
 * If the party is too big (or has too much luggage) for a Personenauto,
 * recommend/auto-select Bus instead of letting the customer pick an
 * incompatible vehicle. The customer never needs to reason about seat
 * counts themselves — this is the one place that decides for them.
 *
 * Examples this satisfies (see pricing/index.test.ts):
 * 3 passengers + 2 bags -> Personenauto; 3 passengers + 5 bags -> Bus;
 * 6+ passengers -> Bus; 7 passengers -> Bus.
 */
export function recommendedVehicle(
  passengers: number,
  luggage: number
): VehicleType {
  return passengers > PERSONENAUTO_MAX_PASSENGERS ||
    luggage > PERSONENAUTO_MAX_LUGGAGE
    ? "BUS"
    : "PERSONENAUTO";
}
