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
  const base = {
    pickup: "Schiphol",
    destination: "Amsterdam",
    date: "2026-10-01",
    time: "14:00",
    vehicleType: "BUS" as const,
    name: "Test Persoon",
    phone: "+31612345678",
    email: "test@example.com",
    luggage: 2,
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
