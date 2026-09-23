import type { VehicleType } from "@/lib/pricing";
import type { Quote } from "@/lib/pricing";

export type BookingFormState = {
  pickup: string;
  destination: string;
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
  form: BookingFormState;
  /** Whether the server actually attempted to send confirmation email(s) — see lib/email.ts's isEmailConfigured(). */
  emailConfirmed: boolean;
};
