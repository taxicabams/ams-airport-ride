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
 */
export const schipholMeetingPoint = {
  verified: false,
  specificInstructions: null as { nl: string; en: string } | null,
  // Covers, in order: what to do on arrival, how the driver is
  // recognizable, and what to do if you don't find them right away —
  // all safe/generic, none of it a specific hall or door.
  general: {
    nl: "Uw chauffeur staat op Schiphol op u te wachten nadat u door de douane bent, herkenbaar aan een naambordje met uw naam. Hij of zij neemt telefonisch of per sms contact met u op om de exacte plek af te spreken — meestal bij het Meeting Point op Schiphol Plaza. Gratis wifi (\"Schiphol_Free_Wi-Fi\") is overal op de luchthaven beschikbaar. Ziet u uw chauffeur niet meteen? Bel of app dan het nummer dat u in uw boekingsbevestiging ontvangt.",
    en: "Your driver will be waiting for you at Schiphol after you clear customs, recognizable by a name sign with your name on it. They'll contact you by phone or text to confirm the exact meeting spot — usually near the Meeting Point at Schiphol Plaza. Free Wi-Fi (\"Schiphol_Free_Wi-Fi\") is available throughout the airport. Can't spot your driver right away? Call or message the number in your booking confirmation.",
  },
} as const;

export function getSchipholMeetingPointText(locale: "nl" | "en"): string {
  if (schipholMeetingPoint.verified && schipholMeetingPoint.specificInstructions) {
    return schipholMeetingPoint.specificInstructions[locale];
  }
  return schipholMeetingPoint.general[locale];
}
