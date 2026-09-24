/**
 * Real vehicle photo, filled in by the client once available — same
 * null-until-confirmed pattern as companyInfo.ts. VehicleShowcase.tsx
 * renders a clean, original placeholder (no stock photo, no AI-generated
 * image) while this is null, and switches to the real photo the moment
 * a path/URL is set here. No other code needs to change when that
 * happens.
 */
export const vehiclePhoto: { url: string | null; alt: { nl: string; en: string } } = {
  url: null,
  alt: {
    nl: "AMS Airport Ride voertuig",
    en: "AMS Airport Ride vehicle",
  },
};
