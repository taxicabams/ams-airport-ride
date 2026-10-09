import { describe, expect, it } from "vitest";
import { calculateQuote } from "./index";
import { BUS_SURCHARGE_EUR } from "./vehicle";
import { PRICES_APPROVED_BY_CLIENT } from "./staticRoutes";
import {
  PRIVATE_RIDE_START_FEE_EUR,
  PRIVATE_RIDE_RATE_PER_KM_EUR,
  PRIVATE_RIDE_RATE_PER_MIN_EUR,
} from "./fallback";

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

  it("prices Schiphol <-> Rotterdam as a fixed €115, exempt from the 30km+ surcharge", () => {
    // Explicit exception, named directly by the client: Utrecht,
    // Rotterdam and Den Haag stay at their normal price — real
    // competition there (train, other taxi firms) plus follow-up local
    // work once he's in the city, unlike smaller far destinations.
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.basePrice).toBe(115);
  });

  it("prices Schiphol <-> Den Haag as a fixed €85, exempt from the 30km+ surcharge", () => {
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

  it("prices Schiphol <-> Almere at +20% of the curated €80, rounded to €95 — 30km+ rule", () => {
    // Estimated ~44km, also over the 30km bump threshold. 80 x 1.2 = 96 -> nearest €5 = 95.
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Almere",
      vehicleType: "PERSONENAUTO",
    });
    expect(quote.source).toBe("fixed"); // still a fixed upfront price — just no longer the raw curated number
    expect(quote.basePrice).toBe(95);
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

  it("prices a Personenauto private ride at start fee + distanceKm x €2.50 + durationMin x €0.50, rounded to a whole euro", () => {
    // Utrecht and Rotterdam are both on the 30km+ surcharge exemption
    // list (see pricing/index.ts) — this is the plain formula, unbumped,
    // even at 40km. The surcharge itself is tested separately below with
    // non-exempt cities.
    const quote = calculateQuote({
      pickup: "Utrecht",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 40, durationMin: 35 },
    });
    // 4.31 + 40x2.50 + 35x0.50 = 4.31 + 100 + 17.5 = 121.81 -> rounds to €122
    expect(quote.rideType).toBe("PRIVATE_RIDE");
    expect(quote.basePrice).toBe(
      Math.round(
        PRIVATE_RIDE_START_FEE_EUR + 40 * PRIVATE_RIDE_RATE_PER_KM_EUR + 35 * PRIVATE_RIDE_RATE_PER_MIN_EUR
      )
    );
    expect(quote.basePrice).toBe(122);
    expect(quote.totalPrice).toBe(122);
  });

  it("adds the Bus surcharge on top of the private-ride formula price, same as everywhere else", () => {
    const quote = calculateQuote({
      pickup: "Utrecht",
      destination: "Rotterdam",
      vehicleType: "BUS",
      routeOverride: { distanceKm: 40, durationMin: 35 },
    });
    expect(quote.basePrice).toBe(122);
    expect(quote.vehicleSurcharge).toBe(BUS_SURCHARGE_EUR);
    expect(quote.totalPrice).toBe(122 + BUS_SURCHARGE_EUR); // 137
  });

  it("a short private ride still goes through the formula (no separate flat minimum for private rides)", () => {
    const quote = calculateQuote({
      pickup: "Utrecht",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 2, durationMin: 8 },
    });
    // 4.31 + 2x2.50 + 8x0.50 = 4.31 + 5 + 4 = 13.31 -> rounds to €13
    expect(quote.basePrice).toBe(13);
  });

  it("a mid-length private ride, worked example: 15km / 20min", () => {
    const quote = calculateQuote({
      pickup: "Utrecht",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 15, durationMin: 20 },
    });
    // 4.31 + 15x2.50 + 20x0.50 = 4.31 + 37.5 + 10 = 51.81 -> rounds to €52
    expect(quote.basePrice).toBe(52);
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

  it("does not override a short (<30km) curated fixed price's basePrice, even with a routeOverride present", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Centrum",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 16, durationMin: 20 }, // realistic for this route, still well under the 30km bump threshold
    });
    expect(quote.source).toBe("fixed");
    expect(quote.basePrice).toBe(50); // unchanged from the curated staticRoutes.ts value
    // But the *displayed* distance/duration do reflect the real route:
    expect(quote.distanceKm).toBe(16);
    expect(quote.distanceSource).toBe("google");
  });
});

describe("calculateQuote — every ride 30km+ gets a clean +20% surcharge, rounded to the nearest €5", () => {
  it("applies it on top of a curated Schiphol price: Zeist's €85 at 52km -> €100", () => {
    // 85 x 1.2 = 102 -> nearest €5 = 100
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Zeist",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 52, durationMin: 60 },
    });
    expect(quote.basePrice).toBe(100);
    expect(quote.source).toBe("fixed"); // still a fixed upfront price, just not the raw curated number
  });

  it("applies the same +20% to a far curated price even when it was already higher than the formula", () => {
    // Dordrecht: curated €125 x 1.2 = 150 -> nearest €5 = 150 (already a multiple of 5)
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Dordrecht",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 72, durationMin: 65 },
    });
    expect(quote.basePrice).toBe(150);
  });

  it("exempts Utrecht, Rotterdam and Den Haag from the surcharge even when 30km+ away — named directly by the client (real competition + follow-up local work there)", () => {
    const rotterdam = calculateQuote({
      pickup: "Schiphol",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 61, durationMin: 55 },
    });
    const utrecht = calculateQuote({
      pickup: "Schiphol",
      destination: "Utrecht",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 45, durationMin: 50 },
    });
    const denHaag = calculateQuote({
      pickup: "Schiphol",
      destination: "Den Haag",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 54, durationMin: 50 },
    });
    expect(rotterdam.basePrice).toBe(115); // curated value, unchanged
    expect(utrecht.basePrice).toBe(80); // curated value, unchanged
    expect(denHaag.basePrice).toBe(85); // curated value, unchanged
  });

  it("does not touch a curated price under 30km", () => {
    const quote = calculateQuote({
      pickup: "Schiphol",
      destination: "Centrum",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 16, durationMin: 20 },
    });
    expect(quote.basePrice).toBe(50); // unchanged curated staticRoutes.ts value
  });

  it("also applies to a far PRIVATE_RIDE with no curated price at all — the rule isn't Schiphol-specific", () => {
    // Amsterdam <-> Zeist — neither end is on the exemption list.
    const quote = calculateQuote({
      pickup: "Amsterdam",
      destination: "Zeist",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 58, durationMin: 55 },
    });
    expect(quote.rideType).toBe("PRIVATE_RIDE");
    const formulaPrice = Math.round(
      PRIVATE_RIDE_START_FEE_EUR + 58 * PRIVATE_RIDE_RATE_PER_KM_EUR + 55 * PRIVATE_RIDE_RATE_PER_MIN_EUR
    ); // 177
    expect(quote.basePrice).toBe(Math.round((formulaPrice * 1.2) / 5) * 5); // 210
  });

  it("does not touch a short PRIVATE_RIDE under 30km", () => {
    const quote = calculateQuote({
      pickup: "Utrecht",
      destination: "Rotterdam",
      vehicleType: "PERSONENAUTO",
      routeOverride: { distanceKm: 15, durationMin: 20 },
    });
    expect(quote.basePrice).toBe(52); // same as the existing "mid-length private ride" test above, unchanged
  });
});

describe("staticRoutes — approval flag", () => {
  it("is not marked as client-approved yet (flip this only once the client signs off)", () => {
    expect(PRICES_APPROVED_BY_CLIENT).toBe(false);
  });
});
