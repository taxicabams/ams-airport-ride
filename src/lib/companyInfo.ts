/**
 * Real company details.
 *
 * "null-until-real" convention: every field here renders nothing at all
 * (not a placeholder, never a fabricated value) until genuinely set —
 * every call site already guards on this (`companyInfo.phone && ...`,
 * etc.), so leaving a field null just cleanly hides that one line/
 * button, nothing breaks.
 *
 * `phone` stays null deliberately, not because it's unknown — the
 * client's own explicit instruction: "ik wil niet gebeld worden alleen
 * whatsapp" (I don't want to be called, only WhatsApp). Every phone
 * link/button site-wide already only renders when `phone` is set, so
 * leaving it null is what actually enforces "no calls" — WhatsApp is
 * the one real, live contact channel from here on.
 *
 * Address/KvK/BTW/ILT-taxivergunning fields were removed outright (not
 * just left null) per the client's own explicit instruction: "beste
 * niks over vergunningen op bedrijfsgegevens etc, alles gewoon
 * amsairportride" (best nothing about permits/company details, just
 * everything as AMS Airport Ride). The site presents as the AMS Airport
 * Ride brand only — no registration numbers, no address, ever, not even
 * as an inert null slot for later. Every render site that used to guard
 * on these fields was updated in the same change (see Footer.tsx and
 * both boek-taxi-schiphol pages).
 */
export const companyInfo = {
  phone: null as string | null,
  whatsapp: "31647114488" as string | null, // international format, no spaces
  email: null as string | null,
  googleReviewsUrl: null as string | null, // no real Google profile yet — stays null, see Reviews.tsx
  googleReviewScore: null as string | null, // e.g. "4.8" — real score only, never invented
  googleReviewCount: null as number | null,
};
