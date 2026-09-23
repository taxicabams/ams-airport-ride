import { z } from "zod";
import { BUS_MAX_PASSENGERS, BUS_MAX_LUGGAGE } from "./pricing/vehicle";

export const placesAutocompleteInputSchema = z.object({
  input: z.string().trim().min(1).max(200),
  sessionToken: z.string().trim().min(1).max(200),
  locale: z.enum(["nl", "en"]).default("nl"),
});

export const placesDetailsInputSchema = z.object({
  placeId: z.string().trim().min(1).max(500),
  sessionToken: z.string().trim().min(1).max(200),
});

/**
 * Shared coordinate pair — present only when the address came from a
 * resolved Google Places selection (Phase 2A). Optional everywhere: a
 * quote/booking without coordinates still works exactly as before,
 * priced by the string-matching fallback (see lib/pricing).
 */
const latLngSchema = z.object({
  pickupLat: z.number().finite().optional(),
  pickupLng: z.number().finite().optional(),
  destinationLat: z.number().finite().optional(),
  destinationLng: z.number().finite().optional(),
});

export const quoteInputSchema = z
  .object({
    pickup: z.string().trim().min(2).max(200),
    destination: z.string().trim().min(2).max(200),
    vehicleType: z.enum(["PERSONENAUTO", "BUS"]),
  })
  .merge(latLngSchema);

/**
 * Two full timestamps compared directly (not date-then-time
 * separately) — this one comparison naturally covers both "return date
 * is before the outbound date" and "same day, but an earlier return
 * time" in one check. Shared by the server-side refine below and by
 * DetailsStep's client-side validation, so the rule can never drift
 * between the two.
 */
export function isReturnDateTimeValid(
  date: string,
  time: string,
  returnDate: string,
  returnTime: string
): boolean {
  if (!date || !time || !returnDate || !returnTime) return false;
  const outbound = new Date(`${date}T${time}`);
  const ret = new Date(`${returnDate}T${returnTime}`);
  if (Number.isNaN(outbound.getTime()) || Number.isNaN(ret.getTime())) return false;
  return ret.getTime() > outbound.getTime();
}

/**
 * Shared by POST /api/bookings. We validate the *whole* form here even
 * though the price itself is always recalculated server-side (see the
 * route handler) — never trust a price the client could have tampered
 * with in the browser.
 *
 * Passenger/luggage ceilings match the biggest vehicle we have (Bus) —
 * BUS_MAX_PASSENGERS/BUS_MAX_LUGGAGE in lib/pricing/vehicle.ts, so
 * "more than the largest vehicle can take" is rejected here too, not
 * just capped in the UI's Stepper.
 */
export const bookingInputSchema = z
  .object({
    pickup: z.string().trim().min(2).max(200),
    destination: z.string().trim().min(2).max(200),
    date: z.string().min(1).max(20),
    time: z.string().min(1).max(20),
    passengers: z.number().int().min(1).max(BUS_MAX_PASSENGERS),
    luggage: z.number().int().min(0).max(BUS_MAX_LUGGAGE),
    vehicleType: z.enum(["PERSONENAUTO", "BUS"]),
    flightNumber: z.string().trim().max(20).optional().default(""),
    name: z.string().trim().min(2).max(200),
    phone: z.string().trim().min(6).max(50),
    email: z.string().trim().max(320).email(),
    notes: z.string().trim().max(1000).optional().default(""),
    returnTrip: z.boolean().default(false),
    returnDate: z.string().max(20).optional().default(""),
    returnTime: z.string().max(20).optional().default(""),
    // Not collected by the v1 UI yet — see BookingFormState — but already
    // part of the contract so the return-ride data architecture (Prisma
    // included) doesn't need a breaking change later.
    returnPickup: z.string().trim().max(200).optional().default(""),
    returnDestination: z.string().trim().max(200).optional().default(""),
    childSeat: z.boolean().default(false),
  })
  .merge(latLngSchema)
  .refine(
    (data) =>
      !data.returnTrip ||
      isReturnDateTimeValid(data.date, data.time, data.returnDate, data.returnTime),
    {
      message: "Return date/time must be after the outbound date/time",
      path: ["returnDate"],
    }
  );

export type BookingInput = z.infer<typeof bookingInputSchema>;
