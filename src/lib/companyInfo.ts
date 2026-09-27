/**
 * Real company details, filled in by the client before launch.
 *
 * TEMPORARY: at the client's own explicit request ("vul gewoon bij alles
 * 1234567 in, ik wil het alleen zien, ik pas het later aan"), every field
 * below is set to an obvious, unmistakably-fake placeholder value so the
 * new "vertrekbord" homepage design can be previewed end-to-end. This is
 * a deliberate, one-time exception to this file's own "null-until-real"
 * convention (still true for every other page/section that reads it) —
 * NOT a green light to reuse "1234567"/"[..]" anywhere else, and NONE of
 * this has been deployed (the client separately asked not to deploy
 * until they've reviewed it).
 *
 * MUST be replaced with real values (or set back to null) before any
 * push to production — search this repo for "1234567" before deploying.
 */
export const companyInfo = {
  phone: "+31 12 345 6789" as string | null,
  whatsapp: "31612345678" as string | null, // international format, no spaces
  email: "info@amsairportride.nl" as string | null,
  address: "Straatnaam 1234567, 1234 AB Schiphol" as string | null,
  kvkNumber: "12345670" as string | null,
  btwNumber: "NL123456789B01" as string | null,
  licenseNumber: "1234567" as string | null, // ILT-taxivergunningnummer
  googleReviewsUrl: null as string | null, // no real Google profile yet — stays null, see Reviews.tsx
  googleReviewScore: null as string | null, // e.g. "4.8" — real score only, never invented
  googleReviewCount: null as number | null,
};
