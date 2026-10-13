import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { track } from "./analytics";

// Real bug found live: track() used to only push a plain object onto
// window.dataLayer — the GTM convention, not gtag.js's own. With no
// GTM installed, that meant every tracked event (most importantly
// booking_completed, which carries the value GA4/Google Ads use for
// the "Aankoop" conversion) silently never reached Google at all,
// despite Analytics.tsx correctly loading gtag.js. These tests lock in
// the fix: track() must call the real window.gtag('event', ...) —
// that's the only thing gtag.js's own processing loop understands.
//
// vi.stubGlobal("window", ...) rather than a jsdom environment: track()
// only ever touches window.gtag/window.dataLayer, never a real DOM API,
// so a plain stub object is enough and avoids adding a new test-only
// dependency (jsdom/happy-dom) just for this one file — this project's
// vitest.config.ts runs everything under the plain "node" environment.
describe("track", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let gtagMock: ReturnType<typeof vi.fn>;
  let dataLayer: unknown[];

  beforeEach(() => {
    // @ts-expect-error -- test-only override of a readonly-in-types env var
    process.env.NODE_ENV = "production"; // suppress the console.debug branch
    gtagMock = vi.fn();
    dataLayer = [];
    vi.stubGlobal("window", { gtag: gtagMock, dataLayer });
  });

  afterEach(() => {
    // @ts-expect-error -- restoring the same readonly-in-types env var
    process.env.NODE_ENV = originalNodeEnv;
    vi.unstubAllGlobals();
  });

  it("calls the real window.gtag('event', name, data) — not just a dataLayer push", () => {
    track("booking_completed", { bookingId: "AMS-1234", value: 60, currency: "EUR" });

    expect(gtagMock).toHaveBeenCalledWith("event", "booking_completed", {
      bookingId: "AMS-1234",
      value: 60,
      currency: "EUR",
    });
  });

  it("calls gtag with an empty object when no data is given", () => {
    track("calculator_started");
    expect(gtagMock).toHaveBeenCalledWith("event", "calculator_started", {});
  });

  it("also still pushes the GTM-style object, for if a GTM container is ever added", () => {
    track("whatsapp_clicked");
    expect(dataLayer).toContainEqual({ event: "whatsapp_clicked" });
  });

  it("never throws when window.gtag isn't defined yet (consent not yet granted / script still loading)", () => {
    vi.stubGlobal("window", { dataLayer });
    expect(() => track("phone_clicked")).not.toThrow();
    // Still queues the GTM-style entry even without gtag present.
    expect(dataLayer).toContainEqual({ event: "phone_clicked" });
  });
});
