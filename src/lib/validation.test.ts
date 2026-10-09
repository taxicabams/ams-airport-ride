import { describe, expect, it } from "vitest";
import {
  isReturnDateTimeValid,
  isDateNotInPast,
  isDateTimeNotInPast,
  bookingInputSchema,
  isValidPhone,
} from "./validation";

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

// isDateTimeNotInPast takes date/time in *local* time (matching what a
// native <input type="date"|"time"> actually produces) — build the
// local-time strings from a Date's local getters, not toISOString()
// (which is UTC and would silently shift by the runner's UTC offset).
function localDateTimeParts(d: Date): { date: string; time: string } {
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

describe("isDateTimeNotInPast", () => {
  it("accepts a time later today", () => {
    const { date, time } = localDateTimeParts(new Date(Date.now() + 2 * 3_600_000));
    expect(isDateTimeNotInPast(date, time)).toBe(true);
  });

  it("rejects a time earlier today (no grace period by default)", () => {
    const { date, time } = localDateTimeParts(new Date(Date.now() - 2 * 3_600_000));
    expect(isDateTimeNotInPast(date, time)).toBe(false);
  });

  it("with a grace period, still accepts a time just a few minutes ago", () => {
    const { date, time } = localDateTimeParts(new Date(Date.now() - 5 * 60_000));
    expect(isDateTimeNotInPast(date, time, 15)).toBe(true);
  });

  it("rejects empty input rather than throwing", () => {
    expect(isDateTimeNotInPast("", "")).toBe(false);
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
    flightNumber: "KL1234", // pickup is Schiphol — now required, see the dedicated describe block below
  };

  it("rejects a booking dated in the past", () => {
    const result = bookingInputSchema.safeParse({ ...base, date: YESTERDAY });
    expect(result.success).toBe(false);
  });

  it("accepts a booking with a date/time 2 hours from now", () => {
    // Date and time must come from the *same* moment — near midnight,
    // "now + 2h" can roll over to tomorrow's date, so forcing date:
    // TODAY while only adjusting the time would test the wrong thing.
    const { date, time } = localDateTimeParts(new Date(Date.now() + 2 * 3_600_000));
    expect(bookingInputSchema.safeParse({ ...base, date, time }).success).toBe(true);
  });

  it("accepts a booking dated next year, regardless of clock time", () => {
    expect(bookingInputSchema.safeParse(base).success).toBe(true);
  });
});

describe("bookingInputSchema — return trip date/time refine", () => {
  // Real bug found live (in the test suite, not the app): this block
  // used to hardcode "2026-09-29" as a stand-in for "some date next
  // year" — it genuinely was next year when first written, but as real
  // time caught up to that literal date, isDateNotInPast started
  // (correctly) rejecting it as "today, but earlier than the current
  // wall-clock time," flipping two tests from pass to fail with zero
  // app-code change. Same class of bug as the file's own NEXT_YEAR
  // helper was already introduced to prevent elsewhere — just missed
  // here. Fixed the same way: compute relative to real "now".
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
    flightNumber: "KL1234", // pickup is Schiphol — now required, see the dedicated describe block below
  };
  const NEXT_YEAR_PLUS_ONE_WEEK = new Date(Date.now() + 372 * 86_400_000).toISOString().slice(0, 10);

  it("passes without a return trip, regardless of return fields", () => {
    expect(bookingInputSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a return trip with a return date/time before the outbound leg", () => {
    const result = bookingInputSchema.safeParse({
      ...base,
      returnTrip: true,
      returnDate: NEXT_YEAR,
      returnTime: "10:00", // before 14:00 outbound, same day
    });
    expect(result.success).toBe(false);
  });

  it("accepts a return trip with a valid later date/time", () => {
    const result = bookingInputSchema.safeParse({
      ...base,
      returnTrip: true,
      returnDate: NEXT_YEAR_PLUS_ONE_WEEK,
      returnTime: "19:00",
    });
    expect(result.success).toBe(true);
  });
});

describe("isValidPhone / bookingInputSchema — phone number", () => {
  // Real booking found live: the old check only verified allowed
  // characters + a 6-char minimum, so "------" or "111111" passed as a
  // "valid" phone number — a customer's driver then had no way to
  // actually reach them.
  const base = {
    pickup: "Amsterdam",
    destination: "Utrecht",
    date: NEXT_YEAR,
    time: "14:00",
    passengers: 1,
    luggage: 1,
    vehicleType: "PERSONENAUTO" as const,
    name: "Test Persoon",
    email: "test@example.com",
  };

  it.each([
    "+31612345678",
    "0612345678",
    "06-12 34 56 78",
    "+1 (415) 555-2671",
  ])("accepts a real-looking phone number: %s", (phone) => {
    expect(isValidPhone(phone)).toBe(true);
    expect(bookingInputSchema.safeParse({ ...base, phone }).success).toBe(true);
  });

  it.each(["------", "111111", "abcdef", "12345"])(
    "rejects a fake/garbage phone number: %s",
    (phone) => {
      expect(isValidPhone(phone)).toBe(false);
      expect(bookingInputSchema.safeParse({ ...base, phone }).success).toBe(false);
    }
  );
});

describe("bookingInputSchema — flight number required for a pickup FROM Schiphol", () => {
  const base = {
    date: NEXT_YEAR,
    time: "14:00",
    passengers: 1,
    luggage: 1,
    vehicleType: "PERSONENAUTO" as const,
    name: "Test Persoon",
    phone: "+31612345678",
    email: "test@example.com",
  };

  it("rejects a Schiphol pickup with no flight number", () => {
    const result = bookingInputSchema.safeParse({
      ...base,
      pickup: "Schiphol",
      destination: "Amsterdam",
      flightNumber: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a Schiphol pickup with a flight number", () => {
    const result = bookingInputSchema.safeParse({
      ...base,
      pickup: "Schiphol",
      destination: "Amsterdam",
      flightNumber: "KL1234",
    });
    expect(result.success).toBe(true);
  });

  it("does not require a flight number for a drop-off AT Schiphol (departure, not arrival)", () => {
    const result = bookingInputSchema.safeParse({
      ...base,
      pickup: "Amsterdam",
      destination: "Schiphol",
      flightNumber: "",
    });
    expect(result.success).toBe(true);
  });

  it("does not require a flight number for a private ride that never touches Schiphol", () => {
    const result = bookingInputSchema.safeParse({
      ...base,
      pickup: "Utrecht",
      destination: "Rotterdam",
      flightNumber: "",
    });
    expect(result.success).toBe(true);
  });
});
