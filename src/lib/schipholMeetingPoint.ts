/**
 * Single source of truth for Schiphol pickup/meeting-point copy — used
 * by the booking wizard (Schiphol info card), the confirmation screen,
 * and the confirmation email. One edit here propagates everywhere; we
 * never hardcode this text in three separate places.
 *
 * `verified: false` because the client's requested "Vertrekhal 3, deur C"
 * could not be confirmed against any official or third-party source
 * (see the plan's research). What ships instead is the verified-safe
 * generic guidance: a named Schiphol Plaza landmark, phone/text contact
 * after customs, and the free airport wifi network — all confirmed
 * against schiphol.nl. Once the client verifies their own drivers'
 * actual door/procedure, set `verified: true` and fill in `specificInstructions`.
 *
 * Deliberately does NOT claim a "name sign"/naambordje, flight
 * monitoring, or any other pickup detail that hasn't been confirmed as
 * something AMS Airport Ride's drivers actually do — the client's own
 * standing rule ("geen verzonnen claims") explicitly names exactly
 * these two as things to never state unless truly offered. Phone/text
 * contact is the one mechanism every booking already guarantees (a real
 * phone number is always collected), so it's the only pickup detail
 * asserted here.
 */
export const schipholMeetingPoint = {
  verified: false,
  specificInstructions: null as { nl: string; en: string } | null,
  // Covers, in order: what to do on arrival, and what to do if you
  // don't hear from the driver right away — all safe/generic, none of
  // it a specific hall/door or an unconfirmed pickup prop.
  general: {
    nl: "Uw chauffeur neemt telefonisch of per sms contact met u op zodra u door de douane bent, om de exacte ophaalplek af te spreken — meestal bij het Meeting Point op Schiphol Plaza. Gratis wifi (\"Schiphol_Free_Wi-Fi\") is overal op de luchthaven beschikbaar. Hoort u niets? Bel of app dan het nummer dat u in uw boekingsbevestiging ontvangt.",
    en: "Your driver will contact you by phone or text as soon as you clear customs, to confirm the exact pickup spot — usually near the Meeting Point at Schiphol Plaza. Free Wi-Fi (\"Schiphol_Free_Wi-Fi\") is available throughout the airport. Haven't heard from them? Call or message the number in your booking confirmation.",
  },
} as const;

export function getSchipholMeetingPointText(locale: "nl" | "en"): string {
  if (schipholMeetingPoint.verified && schipholMeetingPoint.specificInstructions) {
    return schipholMeetingPoint.specificInstructions[locale];
  }
  return schipholMeetingPoint.general[locale];
}
