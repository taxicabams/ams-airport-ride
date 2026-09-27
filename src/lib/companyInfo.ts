/**
 * Real company details, filled in by the client before launch.
 *
 * "null-until-real" convention: every field here renders nothing at all
 * (not a placeholder, never a fabricated value) until the client
 * supplies the genuine number/address/registration — every call site
 * already guards on this (`companyInfo.phone && ...`, etc.), so leaving
 * a field null just cleanly hides that one line/button, nothing breaks.
 *
 * Reverted back to null from a temporary "1234567"-style placeholder
 * state: that state was created for one specific, explicit, one-time
 * request ("vul gewoon bij alles 1234567 in, ik wil het alleen zien, ik
 * pas het later aan") to preview the "vertrekbord" homepage locally, on
 * the client's own explicit condition that it would NOT be deployed —
 * but a real production audit found it live on
 * https://amsairportride.nl (phone, WhatsApp, and a literal "Straatnaam
 * 1234567, 1234 AB Schiphol" address), which must have reached
 * production through a later, unrelated "deploy everything" instruction
 * that didn't know this file still held that temporary state. A fake
 * phone number/address on a live taxi-booking site is a genuine trust
 * and functionality problem for real customers, and inventing a
 * plausible-looking replacement would violate the standing "never
 * fabricate business/legal data" rule just as badly — null is the only
 * honest state until the client supplies their real details.
 */
export const companyInfo = {
  phone: null as string | null,
  whatsapp: null as string | null, // international format, no spaces, e.g. "31612345678"
  email: null as string | null,
  address: null as string | null,
  kvkNumber: null as string | null,
  btwNumber: null as string | null,
  licenseNumber: null as string | null, // ILT-taxivergunningnummer
  googleReviewsUrl: null as string | null, // no real Google profile yet — stays null, see Reviews.tsx
  googleReviewScore: null as string | null, // e.g. "4.8" — real score only, never invented
  googleReviewCount: null as number | null,
};
