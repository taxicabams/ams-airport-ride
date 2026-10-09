import { describe, expect, it } from "vitest";
import {
  recommendedVehicle,
  BUS_MAX_PASSENGERS,
  PERSONENAUTO_MAX_PASSENGERS,
} from "./vehicle";
import { bookingInputSchema } from "../validation";

// The exact examples from the spec, so a future capacity-threshold
// tweak can't silently break the promised behavior.
describe("recommendedVehicle — capacity logic", () => {
  it("3 passengers + 2 bags -> Personenauto is possible", () => {
    expect(recommendedVehicle(3, 2)).toBe("PERSONENAUTO");
  });

  it("3 passengers + 5 bags -> Bus (too much luggage for a Personenauto)", () => {
    expect(recommendedVehicle(3, 5)).toBe("BUS");
  });

  it("6 passengers -> Bus, regardless of luggage", () => {
    expect(recommendedVehicle(6, 0)).toBe("BUS");
  });

  it("7 passengers (the v1 maximum) -> Bus", () => {
    expect(recommendedVehicle(BUS_MAX_PASSENGERS, 2)).toBe("BUS");
  });

  it("exactly at the Personenauto ceiling still fits a Personenauto", () => {
    expect(recommendedVehicle(PERSONENAUTO_MAX_PASSENGERS, PERSONENAUTO_MAX_PASSENGERS)).toBe(
      "PERSONENAUTO"
    );
  });
});

describe("bookingInputSchema — capacity above the Bus maximum is not allowed", () => {
  // A hardcoded future date here previously broke on its own once real
  // time caught up to it (bookingInputSchema correctly rejects past
  // dates — see validation.ts's isDateNotInPast) — this test isn't
  // about date validation at all, just passenger-count limits, so it
  // shouldn't be coupled to a specific calendar date. Same NEXT_YEAR
  // pattern already established in validation.test.ts after it hit this
  // exact class of bug first — computed fresh each run, never in the
  // past.
  const NEXT_YEAR = new Date(Date.now() + 365 * 86_400_000).toISOString().slice(0, 10);

  const base = {
    pickup: "Schiphol",
    destination: "Amsterdam",
    date: NEXT_YEAR,
    time: "14:00",
    vehicleType: "BUS" as const,
    name: "Test Persoon",
    phone: "+31612345678",
    email: "test@example.com",
    luggage: 2,
    flightNumber: "KL1234", // pickup is Schiphol — now required, see validation.test.ts
  };

  it("accepts exactly the maximum (7) passengers", () => {
    const result = bookingInputSchema.safeParse({ ...base, passengers: BUS_MAX_PASSENGERS });
    expect(result.success).toBe(true);
  });

  it("rejects more than 7 passengers — no vehicle in v1 can take that", () => {
    const result = bookingInputSchema.safeParse({ ...base, passengers: BUS_MAX_PASSENGERS + 1 });
    expect(result.success).toBe(false);
  });
});
