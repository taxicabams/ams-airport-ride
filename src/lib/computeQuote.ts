import "server-only";
import { calculateQuote, type Quote, type QuoteInput, type VehicleType } from "./pricing";
import { routesProvider, RoutesNotConfiguredError } from "./routes";

export type CoordQuoteInput = {
  pickup: string;
  destination: string;
  vehicleType: VehicleType;
  pickupLat?: number;
  pickupLng?: number;
  destinationLat?: number;
  destinationLng?: number;
};

/**
 * Shared by both /api/quote and /api/bookings (the latter calls it
 * once or twice — outbound, and again for a return leg with
 * pickup/destination swapped) so the "Google → coordinates → real
 * route/distance → our pricing engine → fixed price" pipeline exists
 * in exactly one place.
 *
 * Deliberately best-effort about Google Routes: coordinates missing
 * (free-text-only address) or the API unreachable/misconfigured both
 * fall through to the existing string-matching distance estimate — a
 * customer must never see a broken price because of an external API
 * hiccup. Google is never what decides the price; it only refines the
 * distance/duration calculateQuote uses.
 */
export async function computeQuoteWithRoute(input: CoordQuoteInput): Promise<Quote> {
  const quoteInput: QuoteInput = {
    pickup: input.pickup,
    destination: input.destination,
    vehicleType: input.vehicleType,
  };

  const { pickupLat, pickupLng, destinationLat, destinationLng } = input;
  if (pickupLat != null && pickupLng != null && destinationLat != null && destinationLng != null) {
    try {
      quoteInput.routeOverride = await routesProvider.computeRoute(
        { lat: pickupLat, lng: pickupLng },
        { lat: destinationLat, lng: destinationLng }
      );
    } catch (error) {
      if (!(error instanceof RoutesNotConfiguredError)) {
        console.error("[routes] computeRoute failed, falling back to estimate:", error);
      }
    }
  }

  return calculateQuote(quoteInput);
}
