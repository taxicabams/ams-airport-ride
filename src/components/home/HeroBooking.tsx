import { Hero } from "@/components/home/Hero";
import { FlightMonitorBar } from "@/components/home/FlightMonitorBar";

/**
 * "Vertrekbord" identity — Hero is now a two-column layout with the
 * booking card embedded directly in its right column (see Hero.tsx), so
 * this wrapper no longer needs the previous Layout 4.0
 * negative-margin/float trick. It now just adds the full-width flight-
 * monitoring example bar directly under the hero, same dark background.
 */
export function HeroBooking() {
  return (
    <section>
      <Hero />
      <FlightMonitorBar />
    </section>
  );
}
