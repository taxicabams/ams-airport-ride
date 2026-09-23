import type { VehicleType } from "@/lib/pricing";
import type { Quote } from "@/lib/pricing";

export type BookingFormState = {
  pickup: string;
  destination: string;
  // Set only when the customer picks a real Google Places suggestion
  // for that field (never just from typing) — see AddressField and
  // RouteStep. `undefined` means "not a resolved address," which
  // RouteStep uses to block Next, independent of whether the text
  // field itself is empty. The lat/lng pair is sent to /api/quote and
  // /api/bookings, which use it for a real Google Routes distance
  // (Phase 2B) — see lib/computeQuote.ts.
  pickupPlaceId?: string;
  pickupLat?: number;
  pickupLng?: number;
  destinationPlaceId?: string;
  destinationLat?: number;
  destinationLng?: number;
  date: string;
  time: string;
  passengers: number;
  luggage: number;
  vehicleType: VehicleType;
  vehicleManuallyChosen: boolean;
  flightNumber: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  returnTrip: boolean;
  returnDate: string;
  returnTime: string;
  // Not collected in the v1 UI yet (a return leg is assumed to mirror
  // the outbound pickup/destination in reverse — see the API route),
  // but present here so the type/validation/DB pipeline is already
  // consistent end-to-end for when Phase 2 adds the fields to
  // ContactStep. See the plan's "return ride architecture" note.
  returnPickup: string;
  returnDestination: string;
  childSeat: boolean;
};

export const initialBookingForm: BookingFormState = {
  pickup: "",
  destination: "",
  date: "",
  time: "",
  passengers: 1,
  luggage: 1,
  vehicleType: "PERSONENAUTO",
  vehicleManuallyChosen: false,
  flightNumber: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
  returnTrip: false,
  returnDate: "",
  returnTime: "",
  returnPickup: "",
  returnDestination: "",
  childSeat: false,
};

export type WizardStep = "route" | "details" | "quote" | "contact" | "confirmed";

export type BookingResult = {
  bookingId: string;
  quote: Quote;
  /** Set only when the customer booked a return trip — the same pricing engine, called again with pickup/destination swapped. */
  returnQuote: Quote | null;
  totalPrice: number;
  form: BookingFormState;
  /** Whether the server actually attempted to send confirmation email(s) — see lib/email.ts's isEmailConfigured(). */
  emailConfirmed: boolean;
};
