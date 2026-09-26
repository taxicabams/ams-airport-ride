import { Hero } from "@/components/home/Hero";
import { BookingWidget } from "@/components/booking/BookingWidget";

/**
 * v10 rebuild — composes the new photo Hero with the booking widget,
 * overlapping the hero's bottom edge on desktop via a negative top
 * margin (per the client's mockup: "een grote witte/glazen bookingbox
 * over de onderkant van de hero heen hangt"). On mobile the negative
 * margin is much smaller — the box returns to normal vertical flow
 * right below the hero, exactly as the brief requires ("bookingbox mag
 * op mobiel niet het volledige scherm overnemen voordat de gebruiker
 * begrijpt waar de site over gaat").
 */
export function HeroBooking() {
  return (
    <section className="bg-background">
      <Hero />
      <div className="relative z-10 mx-auto -mt-6 max-w-3xl px-4 pb-10 sm:-mt-24 sm:px-6 sm:pb-14 md:-mt-32">
        <BookingWidget />
      </div>
    </section>
  );
}
