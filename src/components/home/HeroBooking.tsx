import { Hero } from "@/components/home/Hero";
import { BookingWidget } from "@/components/booking/BookingWidget";

/**
 * Layout 4.0 — Hero is tall and cinematic again (see Hero.tsx), so the
 * booking card gets a real, visible float over its bottom edge: roughly
 * 40-56px of overlap (-mt-10/-mt-14), matching the brief's "ongeveer
 * 30-50px over hero/content heen." Width matches BookingWidget's own
 * max-w-4xl (widened from max-w-3xl) so this wrapper never re-constrains
 * it to the old, narrower size.
 */
export function HeroBooking() {
  return (
    <section className="bg-background">
      <Hero />
      <div className="relative z-10 mx-auto -mt-10 max-w-4xl px-4 pb-10 sm:-mt-14 sm:px-6 sm:pb-16">
        <BookingWidget />
      </div>
    </section>
  );
}
