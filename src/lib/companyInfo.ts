/**
 * Real company details, filled in by the client before launch.
 *
 * Deliberately `null` for anything not yet confirmed — every component
 * that renders one of these fields (phone CTA, WhatsApp button, KvK
 * number, etc.) checks for `null` and simply omits that element rather
 * than falling back to placeholder text. This is the mechanism behind
 * "real trust data only, never a fake placeholder that could
 * accidentally go live": there is no fake number sitting in the code
 * that a missed check could ever render.
 */
export const companyInfo = {
  phone: null as string | null,
  whatsapp: null as string | null, // international format, no spaces, e.g. "31612345678"
  email: null as string | null,
  kvkNumber: null as string | null,
  licenseNumber: null as string | null, // TX-Keurmerk / vergunningsnummer
  googleReviewsUrl: null as string | null,
};
