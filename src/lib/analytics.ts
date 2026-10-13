/**
 * Every call site the plan asks for is already wired into the booking
 * flow — this is the one file that turns those calls into real GA4/
 * Google Ads/GTM events (see components/marketing/Analytics.tsx for
 * what actually loads the scripts, and .env's own note on the env vars
 * that control it).
 */
export type AnalyticsEvent =
  | "calculator_started"
  | "quote_calculated"
  | "vehicle_selected"
  | "booking_started"
  | "booking_completed"
  | "whatsapp_clicked"
  | "phone_clicked"
  | "route_searched"
  | "return_selected"
  | "airport_transfer_selected";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Real bug found live: a booking (AMS-7272, 8 Oct) went through, but 5
 * days and 428 ad clicks later Google Ads still showed "tag niet
 * geverifieerd voor: Aankoop" — zero conversions registered anywhere,
 * even though Analytics.tsx was confirmed (live dataLayer check) to be
 * loading gtag.js correctly. The actual cause: this function used to
 * push a plain object (`{ event: "booking_completed", ... }`) straight
 * onto `window.dataLayer` — that's Google Tag MANAGER's own convention
 * (a GTM container's trigger system watches for exactly that shape),
 * but this site has no GTM installed (NEXT_PUBLIC_GTM_ID is empty) —
 * only plain gtag.js. gtag.js's own processing loop expects each
 * dataLayer entry to be an `arguments`-like object from an actual
 * `gtag(...)` call (`gtag('event', name, params)` becomes
 * `dataLayer.push(arguments)` inside Analytics.tsx's own init script —
 * see that file) — a bare object with an `event` key has no numeric
 * index, so gtag.js silently ignored every single one of these pushes.
 * Only the automatic `gtag('config', ID)` page-view ping (fired once
 * per page load, unconditionally) was ever actually reaching Google —
 * exactly why ad clicks/impressions tracked fine (Google Ads measures
 * its own clicks independently of this site's tag) while conversions
 * never did.
 *
 * Fixed by calling the real `window.gtag` function Analytics.tsx
 * defines globally, using its real calling convention — this reaches
 * both the GA4 property and the Google Ads account (both configured
 * via separate `gtag('config', ...)` calls sharing one gtag.js
 * instance) as a named custom event, good for GA4's own reporting.
 * Still also pushes the old GTM-style object afterward — harmless
 * today, and means adding a real GTM container later (NEXT_PUBLIC_GTM_ID)
 * would start working immediately with zero changes here. Guards on
 * `typeof window.gtag === "function"` rather than assuming it's always
 * ready: Analytics.tsx only defines it after consent + script load, so
 * an event fired in that narrow window before it's ready is skipped
 * rather than throwing.
 */
export function track(event: AnalyticsEvent, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, data ?? {});
  }
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, data ?? {});
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

/**
 * The Google Ads "Aankoop" conversion ACTION specifically — separate
 * from the generic `track("booking_completed", ...)` call above. Real
 * gap found live: a plain named event (even one correctly reaching
 * Google via `gtag('event', ...)`, see track()'s own note) is NOT
 * enough for Google Ads to attribute it to a configured conversion
 * action — Google's own emailed setup instructions for this exact
 * account require the literal event name `'conversion'` plus a
 * `send_to` pointing at this specific action's conversion ID *and*
 * label (`AW-18476470702/neUnCNmiv5QdEK6joupE` — the label is unique
 * per conversion action, shown once in Google Ads/this exact email,
 * never guessable from the AW- ID alone). Without it, Google Ads has no
 * way to know a `booking_completed` GA4-style event is "the" purchase
 * conversion it's listening for — confirmed live: 428 clicks and one
 * real booking in, Ads still reported "tag niet geverifieerd" even
 * after track() itself was fixed.
 *
 * `transactionId` is the human-facing booking reference (e.g.
 * "AMS-7272") — Google's own instructions: this is what stops the same
 * conversion from ever being double-counted, so it must be unique per
 * booking, never blank (their own template snippet ships with transaction_id: ''
 * as a placeholder to fill in, not a real empty default).
 */
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const GOOGLE_ADS_PURCHASE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL;
const googleAdsPurchaseSendTo =
  GOOGLE_ADS_ID && GOOGLE_ADS_PURCHASE_LABEL ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_PURCHASE_LABEL}` : undefined;

export function trackGoogleAdsPurchase({
  value,
  currency,
  transactionId,
}: {
  value: number;
  currency: string;
  transactionId: string;
}) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics] googleAdsPurchase", { value, currency, transactionId });
  }
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function" || !googleAdsPurchaseSendTo) return;

  window.gtag("event", "conversion", {
    send_to: googleAdsPurchaseSendTo,
    value,
    currency,
    transaction_id: transactionId,
  });
}
