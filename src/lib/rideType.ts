import { matchLocation } from "./locations";

export type RideType = "AIRPORT_TRANSFER" | "PRIVATE_RIDE";

/**
 * One platform, two ride types — the customer never picks between them.
 * We derive it from whatever they typed as pickup/destination: if either
 * side resolves to a known airport (Schiphol in v1), this is an airport
 * transfer and the booking wizard reveals flight-number + Schiphol
 * pickup info. Everything else is a private ride and stays minimal.
 */
export function detectRideType(pickup: string, destination: string): RideType {
  const isAirport = (value: string) => matchLocation(value)?.isAirport === true;
  return isAirport(pickup) || isAirport(destination)
    ? "AIRPORT_TRANSFER"
    : "PRIVATE_RIDE";
}
