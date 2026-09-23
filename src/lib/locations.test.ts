import { describe, expect, it } from "vitest";
import { matchLocation } from "./locations";

describe("matchLocation", () => {
  // Regression test for a real bug found during manual QA: "amsterdam"
  // was matching Schiphol's "amsterdam airport" alias (a plain substring
  // match), which silently broke Schiphol<->Amsterdam pricing. Fixed by
  // removing that alias and switching to word-boundary matching.
  it("does not match plain 'Amsterdam' to Schiphol", () => {
    const result = matchLocation("Amsterdam");
    expect(result?.id).toBe("amsterdam");
    expect(result?.isAirport).toBe(false);
  });

  it("matches 'Schiphol' to the airport", () => {
    expect(matchLocation("Schiphol")?.id).toBe("schiphol");
    expect(matchLocation("Schiphol Airport")?.isAirport).toBe(true);
  });

  it("matches the airport code 'AMS' to Schiphol, not Amsterdam", () => {
    expect(matchLocation("AMS")?.id).toBe("schiphol");
  });

  it("matches specific Amsterdam areas to their own location, not a neighbor", () => {
    expect(matchLocation("Zuid")?.id).toBe("zuid");
    expect(matchLocation("Centrum")?.id).toBe("centrum");
    expect(matchLocation("Osdorp")?.id).toBe("nieuw-west-osdorp");
    expect(matchLocation("Buitenveldert")?.id).toBe("buitenveldert");
  });

  it("matches a generic surrounding city", () => {
    expect(matchLocation("Rotterdam")?.id).toBe("rotterdam");
    expect(matchLocation("Almere Stad")?.id).toBe("almere-stad");
  });

  it("returns undefined for unrecognized free text", () => {
    expect(matchLocation("Ergens Onbekend 123")).toBeUndefined();
    expect(matchLocation("")).toBeUndefined();
  });
});
