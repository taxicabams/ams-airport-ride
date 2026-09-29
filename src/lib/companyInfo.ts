/**
 * Real company details, filled in by the client before launch.
 *
 * "null-until-real" convention: every field here renders nothing at all
 * (not a placeholder, never a fabricated value) until the client
 * supplies the genuine number/address/registration — every call site
 * already guards on this (`companyInfo.phone && ...`, etc.), so leaving
 * a field null just cleanly hides that one line/button, nothing breaks.
 *
 * `phone` stays null deliberately, not because it's unknown — the
 * client's own explicit instruction: "ik wil niet gebeld worden alleen
 * whatsapp" (I don't want to be called, only WhatsApp). Every phone
 * link/button site-wide already only renders when `phone` is set, so
 * leaving it null is what actually enforces "no calls" — WhatsApp is
 * the one real, live contact channel from here on.
 */
export const companyInfo = {
  phone: null as string | null,
  whatsapp: "31647114488" as string | null, // international format, no spaces
  email: null as string | null,
  address: null as string | null,
  kvkNumber: null as string | null,
  btwNumber: null as string | null,
  licenseNumber: null as string | null, // ILT-taxivergunningnummer
  googleReviewsUrl: null as string | null, // no real Google profile yet — stays null, see Reviews.tsx
  googleReviewScore: null as string | null, // e.g. "4.8" — real score only, never invented
  googleReviewCount: null as number | null,
};
