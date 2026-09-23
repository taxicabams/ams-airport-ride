/**
 * Architecture-only in v1: every call site the plan asks for is already
 * wired into the booking flow, but this just logs in dev and no-ops in
 * production until Phase 2 plugs in GA4 + Ads/TikTok pixels here — at
 * that point this is the only file that changes, not the components
 * that call track().
 */
export type AnalyticsEvent =
  | "calculator_started"
  | "price_calculated"
  | "booking_started"
  | "booking_completed"
  | "whatsapp_clicked"
  | "phone_clicked"
  | "route_searched";

export function track(event: AnalyticsEvent, data?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event, data ?? {});
  }
  // Phase 2: forward to GA4 (window.gtag) and/or a TikTok pixel here.
}
