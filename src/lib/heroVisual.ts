/**
 * Real hero photo, filled in by the client once available — same
 * null-until-confirmed pattern as vehiclePhoto.ts/companyInfo.ts. Hero.tsx
 * renders an original illustration (route-line + plane motif, no stock
 * photo, no AI-generated image, no scraped image) while this is null.
 *
 * Deliberately null today: the brief asked for a photo of a professional
 * dark sedan with Schiphol in the background, but no real photo of AMS
 * Airport Ride's actual vehicle/driver exists yet. Using a photo grabbed
 * from a search engine was considered and rejected — it would very likely
 * be someone else's copyrighted image, and would misrepresent a vehicle
 * that isn't actually this business's as if it were, which conflicts with
 * this project's standing "never show something that isn't true" rule.
 */
export const heroVisual: { url: string | null; alt: { nl: string; en: string } } = {
  url: null,
  alt: {
    nl: "AMS Airport Ride — taxi van en naar Schiphol",
    en: "AMS Airport Ride — taxi to and from Schiphol",
  },
};
