export type VehicleType = "PERSONENAUTO" | "BUS";

/**
 * Deliberately simple, per the client's spec: exactly two vehicle
 * options, no Economy/Business/Premium tiers. The bus surcharge is one
 * named constant so it's a one-line change later, never scattered
 * inline math.
 */
export const BUS_SURCHARGE_EUR = 15;

/** A Personenauto seats up to this many passengers; beyond that, Bus. */
export const PERSONENAUTO_MAX_PASSENGERS = 4;
/** Rough capacity heuristic: more bags than this need the bigger boot. */
export const PERSONENAUTO_MAX_LUGGAGE = 4;

export function vehicleSurchargeFor(vehicleType: VehicleType): number {
  return vehicleType === "BUS" ? BUS_SURCHARGE_EUR : 0;
}

/**
 * If the party is too big (or has too much luggage) for a Personenauto,
 * recommend/auto-select Bus instead of letting the customer pick an
 * incompatible vehicle. Kept as a plain-language UI note, not a hard
 * validation error.
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
