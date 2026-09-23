import { describe, expect, it } from "vitest";
import { calculateQuote } from "./index";
import { BUS_SURCHARGE_EUR } from "./vehicle";
import { PRICES_APPROVED_BY_CLIENT } from "./staticRoutes";

// These fixed prices are the client's own starting price list — see the
// big comment in staticRoutes.ts. Asserting exact numbers here means a
// future price change is a deliberate, visible edit to this test, not a
// silent regression; it does NOT mean the numbers are final (see the
// approval flag test below).
describe("calculateQuote — curated Schiphol routes", () => {
  it("prices Schiphol <-> Amsterdam Centrum as a fixed €50", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Centrum",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.rideType).toBe("AIRPORT_TRANSFER");
    expect(quote.source).toBe("fixed");
    expect(quote.basePrice).toBe(50);
    expect(quote.totalPrice).toBe(50);
  });

  it("prices Schiphol <-> Sloten (cheapest Amsterdam area) as a fixed €35", () => {
    const quote = calculateQuote({
      pickup: "Sloten",
      destination: "Schiphol",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.basePrice).toBe(35);
  });

  it("prices Schiphol <-> Zuidoost as a fixed €55", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Zuidoost",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.basePrice).toBe(55);
  });

  it("prices Schiphol <-> Amstelveen as a fixed €40", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Amstelveen",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.basePrice).toBe(40);
  });

  it("prices Schiphol <-> Rotterdam as a fixed €115", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.basePrice).toBe(115);
  });

  it("prices Schiphol <-> Den Haag as a fixed €85", () => {
    const quote = calculateQuote({
      pickup: "Den Haag",
      destination: "Schiphol",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.basePrice).toBe(85);
  });

  it("prices Schiphol <-> Amsterdam West as a fixed €45", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Amsterdam West",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.rideType).toBe("AIRPORT_TRANSFER");
    expect(quote.source).toBe("fixed");
    expect(quote.basePrice).toBe(45);
  });

  it("prices Schiphol <-> Almere as a fixed €80", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Almere",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.source).toBe("fixed");
    expect(quote.basePrice).toBe(80);
  });
});

describe("calculateQuote — Bus vehicle surcharge", () => {
  it("adds exactly the configured surcharge on top of the base price, never a different amount", () => {
    const routes = [
      { pickup: "Schiphol", destination: "Centrum" }, // 50
      { pickup: "Schiphol", destination: "Sloten" }, // 35
      { pickup: "Schiphol", destination: "Rotterdam" }, // 115
    ];

    for (const route of routes) {
      const car = calculateQuote({ ...route, vehicleType: "PERSONENAUTO" });
      const bus = calculateQuote({ ...route, vehicleType: "BUS" });

      expect(bus.basePrice).toBe(car.basePrice); // base price itself is vehicle-independent
      expect(bus.vehicleSurcharge).toBe(BUS_SURCHARGE_EUR);
      expect(bus.totalPrice).toBe(car.totalPrice + BUS_SURCHARGE_EUR);
      expect(bus.totalPrice - car.totalPrice).toBe(15);
    }
  });
});

describe("calculateQuote — private rides (not touching Schiphol)", () => {
  it("is a PRIVATE_RIDE, not a curated fixed price, for a plain city-to-city route", () => {
    const quote = calculateQuote({
      pickup: "Utrecht",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.rideType).toBe("PRIVATE_RIDE");
    expect(quote.source).toBe("estimate");
  });

  it("Amsterdam -> Utrecht is a private ride, priced by the fallback formula", () => {
    const quote = calculateQuote({
      pickup: "Amsterdam",
      destination: "Utrecht",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.rideType).toBe("PRIVATE_RIDE");
    expect(quote.source).toBe("estimate");
    expect(quote.basePrice).toBeGreaterThan(0);
  });
});

describe("calculateQuote — Google Routes override (Phase 2B)", () => {
  it("uses the real distance/duration when a routeOverride is given, and reports distanceSource", () => {
    const withoutOverride = calculateQuote({
      pickup: "Utrecht",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
    });
    expect(withoutOverride.distanceSource).toBe("estimate");

    const withOverride = calculateQuote({
      pickup: "Utrecht",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 57.3, durationMin: 42 },
    });

    expect(withOverride.distanceKm).toBe(57.3);
    expect(withOverride.durationMin).toBe(42);
    expect(withOverride.distanceSource).toBe("google");
    // The fallback formula's price now derives from the *real* distance,
    // not the haversine guess — so it can legitimately differ.
    expect(withOverride.basePrice).toBeGreaterThan(0);
  });

  it("never overrides a curated fixed price's basePrice, even with a routeOverride present", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Centrum",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 999, durationMin: 999 }, // deliberately absurd
    });
    expect(quote.source).toBe("fixed");
    expect(quote.basePrice).toBe(50); // unchanged from the curated staticRoutes.ts value
    // But the *displayed* distance/duration do reflect the real route:
    expect(quote.distanceKm).toBe(999);
    expect(quote.distanceSource).toBe("google");
  });
});

describe("staticRoutes — approval flag", () => {
  it("is not marked as client-approved yet (flip this only once the client signs off)", () => {
    expect(PRICES_APPROVED_BY_CLIENT).toBe(false);
  });
});
