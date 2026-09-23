import { describe, expect, it } from "vitest";
import { STEP_ORDER } from "./stepOrder";

describe("STEP_ORDER", () => {
  it("shows the price (quote step) before asking for contact info — never the other way round", () => {
    expect(STEP_ORDER.indexOf("quote")).toBeLessThan(STEP_ORDER.indexOf("contact"));
  });

  it("collects the route before trip details, and trip details before the price", () => {
    expect(STEP_ORDER.indexOf("route")).toBeLessThan(STEP_ORDER.indexOf("details"));
    expect(STEP_ORDER.indexOf("details")).toBeLessThan(STEP_ORDER.indexOf("quote"));
  });
});
