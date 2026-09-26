import { describe, expect, it } from "vitest";
import { isReturnDateTimeValid, isDateNotInPast, bookingInputSchema } from "./validation";

// Computed relative to "now" (not hardcoded) so these never go stale.
const TODAY = new Date().toISOString().slice(0, 10);
const YESTERDAY = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
const NEXT_YEAR = new Date(Date.now() + 365 * 86_400_000).toISOString().slice(0, 10);

describe("isReturnDateTimeValid", () => {
  it("accepts a return date after the outbound date", () => {
    expect(isReturnDateTimeValid("2026-09-29", "14:00", "2026-10-05", "10:00")).toBe(true);
  });

  it("rejects a return date before the outbound date", () => {
    expect(isReturnDateTimeValid("2026-09-29", "14:00", "2026-09-28", "23:00")).toBe(false);
  });

  it("on the same day, requires the return time to be strictly later", () => {
    expect(isReturnDateTimeValid("2026-09-29", "14:00", "2026-09-29", "19:00")).toBe(true);
    expect(isReturnDateTimeValid("2026-09-29", "14:00", "2026-09-29", "14:00")).toBe(false);
    expect(isReturnDateTimeValid("2026-09-29", "14:00", "2026-09-29", "09:00")).toBe(false);
  });

  it("rejects incomplete input rather than throwing", () => {
    expect(isReturnDateTimeValid("", "14:00", "2026-09-29", "19:00")).toBe(false);
    expect(isReturnDateTimeValid("2026-09-29", "14:00", "", "")).toBe(false);
  });
});

describe("isDateNotInPast", () => {
  it("accepts today", () => {
    expect(isDateNotInPast(TODAY)).toBe(true);
  });

  it("accepts a future date", () => {
    expect(isDateNotInPast(NEXT_YEAR)).toBe(true);
  });

  it("rejects yesterday", () => {
    expect(isDateNotInPast(YESTERDAY)).toBe(false);
  });

  it("rejects a date far in the past (a real bug found live: this used to leave 'Bereken vaste prijs' enabled)", () => {
    expect(isDateNotInPast("2020-01-01")).toBe(false);
  });

  it("rejects empty input rather than throwing", () => {
    expect(isDateNotInPast("")).toBe(false);
  });
});

describe("bookingInputSchema — date must not be in the past", () => {
  const base = {
    pickup: "Schiphol",
    destination: "Amsterdam",
    date: NEXT_YEAR,
    time: "14:00",
    passengers: 1,
    luggage: 1,
    vehicleType: "PERSONENAUTO" as const,
    name: "Test Persoon",
    phone: "+31612345678",
    email: "test@example.com",
  };

  it("rejects a booking dated in the past", () => {
    const result = bookingInputSchema.safeParse({ ...base, date: YESTERDAY });
    expect(result.success).toBe(false);
  });

  it("accepts a booking dated today or later", () => {
    expect(bookingInputSchema.safeParse({ ...base, date: TODAY }).success).toBe(true);
    expect(bookingInputSchema.safeParse(base).success).toBe(true);
  });
});

describe("bookingInputSchema — return trip date/time refine", () => {
  const base = {
    pickup: "Schiphol",
    destination: "Amsterdam",
    date: "2026-09-29",
    time: "14:00",
    passengers: 1,
    luggage: 1,
    vehicleType: "PERSONENAUTO" as const,
    name: "Test Persoon",
    phone: "+31612345678",
    email: "test@example.com",
  };

  it("passes without a return trip, regardless of return fields", () => {
    expect(bookingInputSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a return trip with a return date/time before the outbound leg", () => {
    const result = bookingInputSchema.safeParse({
      ...base,
      returnTrip: true,
      returnDate: "2026-09-29",
      returnTime: "10:00", // before 14:00 outbound, same day
    });
    expect(result.success).toBe(false);
  });

  it("accepts a return trip with a valid later date/time", () => {
    const result = bookingInputSchema.safeParse({
      ...base,
      returnTrip: true,
      returnDate: "2026-10-05",
      returnTime: "19:00",
    });
    expect(result.success).toBe(true);
  });
});
