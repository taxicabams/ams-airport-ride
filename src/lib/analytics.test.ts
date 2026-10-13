import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

// Real bug found live: track() used to only push a plain object onto
// window.dataLayer — the GTM convention, not gtag.js's own. With no
// GTM installed, that meant every tracked event (most importantly
// booking_completed, which carries the value GA4/Google Ads use for
// the "Aankoop" conversion) silently never reached Google at all,
// despite Analytics.tsx correctly loading gtag.js. These tests lock in
// the fix: track() must call the real window.gtag('event', ...) —
// that's the only thing gtag.js's own processing loop understands.
//
// vi.stubGlobal("window", ...) rather than a jsdom environment: this
// file only ever touches window.gtag/window.dataLayer, never a real
// DOM API, so a plain stub object is enough and avoids adding a new
// test-only dependency (jsdom/happy-dom) — this project's
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

  it("calls the real window.gtag('event', name, data) — not just a dataLayer push", async () => {
    const { track } = await import("./analytics");
    track("booking_completed", { bookingId: "AMS-1234", value: 60, currency: "EUR" });

    expect(gtagMock).toHaveBeenCalledWith("event", "booking_completed", {
      bookingId: "AMS-1234",
      value: 60,
      currency: "EUR",
    });
  });

  it("calls gtag with an empty object when no data is given", async () => {
    const { track } = await import("./analytics");
    track("calculator_started");
    expect(gtagMock).toHaveBeenCalledWith("event", "calculator_started", {});
  });

  it("also still pushes the GTM-style object, for if a GTM container is ever added", async () => {
    const { track } = await import("./analytics");
    track("whatsapp_clicked");
    expect(dataLayer).toContainEqual({ event: "whatsapp_clicked" });
  });

  it("never throws when window.gtag isn't defined yet (consent not yet granted / script still loading)", async () => {
    vi.stubGlobal("window", { dataLayer });
    const { track } = await import("./analytics");
    expect(() => track("phone_clicked")).not.toThrow();
    // Still queues the GTM-style entry even without gtag present.
    expect(dataLayer).toContainEqual({ event: "phone_clicked" });
  });
});

// Real gap found live, separate from the bug above: even after track()
// correctly reached Google via gtag('event', ...), Google Ads kept
// reporting "tag niet geverifieerd voor: Aankoop" — Google's own emailed
// setup instructions for this exact conversion action require the
// literal event name 'conversion' plus a `send_to` naming this specific
// action's conversion ID *and* label, not just any named event. These
// tests lock in that exact shape.
describe("trackGoogleAdsPurchase", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const originalLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL;
  let gtagMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // @ts-expect-error -- test-only override of a readonly-in-types env var
    process.env.NODE_ENV = "production";
    gtagMock = vi.fn();
    vi.stubGlobal("window", { gtag: gtagMock, dataLayer: [] });
    vi.resetModules(); // analytics.ts reads these env vars once, at module load
  });

  afterEach(() => {
    // @ts-expect-error -- restoring the same readonly-in-types env var
    process.env.NODE_ENV = originalNodeEnv;
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID = originalAdsId;
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL = originalLabel;
    vi.unstubAllGlobals();
  });

  it("fires gtag('event', 'conversion', {send_to: 'AW-ID/label', ...}) — Google's own exact required shape", async () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID = "AW-18476470702";
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL = "neUnCNmiv5QdEK6joupE";
    const { trackGoogleAdsPurchase } = await import("./analytics");

    trackGoogleAdsPurchase({ value: 60, currency: "EUR", transactionId: "AMS-7272" });

    expect(gtagMock).toHaveBeenCalledWith("event", "conversion", {
      send_to: "AW-18476470702/neUnCNmiv5QdEK6joupE",
      value: 60,
      currency: "EUR",
      transaction_id: "AMS-7272",
    });
  });

  it("does nothing when the purchase label isn't configured yet — never sends a half-formed send_to", async () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID = "AW-18476470702";
    delete process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL;
    const { trackGoogleAdsPurchase } = await import("./analytics");

    trackGoogleAdsPurchase({ value: 60, currency: "EUR", transactionId: "AMS-7272" });

    expect(gtagMock).not.toHaveBeenCalled();
  });

  it("never throws when gtag isn't ready yet", async () => {
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID = "AW-18476470702";
    process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL = "neUnCNmiv5QdEK6joupE";
    vi.stubGlobal("window", { dataLayer: [] });
    const { trackGoogleAdsPurchase } = await import("./analytics");

    expect(() =>
      trackGoogleAdsPurchase({ value: 60, currency: "EUR", transactionId: "AMS-7272" })
    ).not.toThrow();
  });
});
