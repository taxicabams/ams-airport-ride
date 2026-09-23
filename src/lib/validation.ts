import { z } from "zod";
import { BUS_MAX_PASSENGERS, BUS_MAX_LUGGAGE } from "./pricing/vehicle";

export const quoteInputSchema = z.object({
  pickup: z.string().trim().min(2),
  destination: z.string().trim().min(2),
  vehicleType: z.enum(["PERSONENAUTO", "BUS"]),
});

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
export const bookingInputSchema = z.object({
  pickup: z.string().trim().min(2),
  destination: z.string().trim().min(2),
  date: z.string().min(1),
  time: z.string().min(1),
  passengers: z.number().int().min(1).max(BUS_MAX_PASSENGERS),
  luggage: z.number().int().min(0).max(BUS_MAX_LUGGAGE),
  vehicleType: z.enum(["PERSONENAUTO", "BUS"]),
  flightNumber: z.string().trim().max(20).optional().default(""),
  name: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  email: z.string().trim().email(),
  notes: z.string().trim().max(1000).optional().default(""),
  returnTrip: z.boolean().default(false),
  returnDate: z.string().optional().default(""),
  returnTime: z.string().optional().default(""),
  // Not collected by the v1 UI yet — see BookingFormState — but already
  // part of the contract so the return-ride data architecture (Prisma
  // included) doesn't need a breaking change later.
  returnPickup: z.string().trim().max(200).optional().default(""),
  returnDestination: z.string().trim().max(200).optional().default(""),
  childSeat: z.boolean().default(false),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;
