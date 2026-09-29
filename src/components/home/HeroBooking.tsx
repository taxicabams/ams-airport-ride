import { Hero } from "@/components/home/Hero";

/**
 * "Vertrekbord" identity — Hero is now a two-column layout with the
 * booking card embedded directly in its right column (see Hero.tsx), so
 * this wrapper no longer needs the previous Layout 4.0
 * negative-margin/float trick.
 *
 * The flight-monitoring example bar (FlightMonitorBar) that used to sit
 * directly under the hero has been removed here per explicit client
 * request ("haal die stukje met vluchtinformatie weg, ik hoef dat
 * niet") — the component file itself is untouched in case this is
 * revisited later, just no longer rendered on the homepage. The actual
 * flight-number field in the booking form (DetailsStep) and the real
 * "wij houden rekening met vertraging" policy are unaffected — this
 * only removed the illustrative example bar, not the underlying
 * functionality or the honest badge copy in the hero itself.
 */
export function HeroBooking() {
  return (
    <section>
      <Hero />
    </section>
  );
}
