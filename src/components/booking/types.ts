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
  childSeat: false,
};

export type WizardStep = "route" | "details" | "quote" | "contact" | "confirmed";

export type BookingResult = {
  bookingId: string;
  quote: Quote;
  form: BookingFormState;
};
