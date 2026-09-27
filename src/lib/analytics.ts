/**
 * Every call site the plan asks for is already wired into the booking
 * flow — this is the one file that turns those calls into real GA4/GTM
 * events, via the same `dataLayer` push both GA4's gtag.js and Google
 * Tag Manager already read from (see components/marketing/Analytics.tsx
 * for what actually loads the scripts, and .env's own note on the two
 * env vars that control it). Pushing to `window.dataLayer` is safe even
 * before either script has loaded — it's a plain array that queues
 * events until something reads it — and a complete no-op (nothing sent
 * anywhere) while neither NEXT_PUBLIC_GA4_ID nor NEXT_PUBLIC_GTM_ID is
 * set, same as before.
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
  }
}

export function track(event: AnalyticsEvent, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, data ?? {});
  }
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}
