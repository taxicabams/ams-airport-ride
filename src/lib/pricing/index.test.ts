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
});

describe("staticRoutes — approval flag", () => {
  it("is not marked as client-approved yet (flip this only once the client signs off)", () => {
    expect(PRICES_APPROVED_BY_CLIENT).toBe(false);
  });
});
