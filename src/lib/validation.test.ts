import { describe, expect, it } from "vitest";
import { isReturnDateTimeValid, bookingInputSchema } from "./validation";

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
