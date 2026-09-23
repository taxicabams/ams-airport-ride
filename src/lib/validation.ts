import { z } from "zod";

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
 */
export const bookingInputSchema = z.object({
  pickup: z.string().trim().min(2),
  destination: z.string().trim().min(2),
  date: z.string().min(1),
  time: z.string().min(1),
  passengers: z.number().int().min(1).max(8),
  luggage: z.number().int().min(0).max(8),
  vehicleType: z.enum(["PERSONENAUTO", "BUS"]),
  flightNumber: z.string().trim().max(20).optional().default(""),
  name: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  email: z.string().trim().email(),
  notes: z.string().trim().max(1000).optional().default(""),
  returnTrip: z.boolean().default(false),
  returnDate: z.string().optional().default(""),
  returnTime: z.string().optional().default(""),
  childSeat: z.boolean().default(false),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;
