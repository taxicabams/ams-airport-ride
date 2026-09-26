import { Hero } from "@/components/home/Hero";
import { BookingWidget } from "@/components/booking/BookingWidget";

/**
 * v12 — Hero is now much shorter (see Hero.tsx), so the overlap margin
 * is a small, tasteful tuck rather than the large one a taller hero
 * needed — just enough to read as "the card comes out of the photo,"
 * not enough to cover the subtitle text above it. The real goal here is
 * the client's explicit ask: the booking must appear almost
 * immediately, not after a large hero.
 */
export function HeroBooking() {
  return (
    <section className="bg-background">
      <Hero />
      <div className="relative z-10 mx-auto -mt-3 max-w-3xl px-4 pb-10 sm:-mt-6 sm:px-6 sm:pb-14">
        <BookingWidget />
      </div>
    </section>
  );
}
