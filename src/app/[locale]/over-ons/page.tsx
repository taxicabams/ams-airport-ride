import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Locale = "nl" | "en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return locale === "nl"
    ? { title: "Over ons", description: "Maak kennis met AMS Airport Ride, uw taxi- en airporttransferpartner voor Schiphol en heel Nederland." }
    : { title: "About us", description: "Meet AMS Airport Ride, your taxi and airport transfer partner for Schiphol and the whole of the Netherlands." };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">
        {l === "nl" ? "Over AMS Airport Ride" : "About AMS Airport Ride"}
      </h1>

      {l === "nl" ? (
        <div className="mt-6 space-y-4 text-foreground/90">
          <p>
            AMS Airport Ride is opgericht met één duidelijk doel: taxivervoer van en naar
            Schiphol zo eenvoudig en betrouwbaar mogelijk maken. Onze klanten weten vooraf
            precies wat ze betalen, weten precies waar ze hun chauffeur vinden, en hoeven
            pas na de rit te betalen.
          </p>
          <p>
            Onze focus ligt op Schiphol — ritten van en naar Amsterdam, Amstelveen, Haarlem,
            Utrecht, Rotterdam en Den Haag — maar we boeken net zo goed gewone privéritten
            tussen andere Nederlandse steden. Eén platform, één eenvoudige manier van boeken,
            voor elke rit.
          </p>
          <p>
            We geloven dat een goede taxi-ervaring begint bij duidelijkheid: een vaste prijs
            vooraf, heldere instructies over waar u uw chauffeur vindt, en geen onnodige
            stappen in het boekingsproces.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4 text-foreground/90">
          <p>
            AMS Airport Ride was founded with one clear goal: to make taxi transport to and
            from Schiphol as simple and reliable as possible. Our customers know exactly what
            they&apos;ll pay upfront, know exactly where to find their driver, and only pay after
            the ride.
          </p>
          <p>
            Our focus is on Schiphol — rides to and from Amsterdam, Amstelveen, Haarlem,
            Utrecht, Rotterdam, and The Hague — but we&apos;re just as happy to book regular
            private rides between other Dutch cities. One platform, one simple way to book,
            for every ride.
          </p>
          <p>
            We believe a good taxi experience starts with clarity: a fixed price upfront,
            clear instructions on where to find your driver, and no unnecessary steps in the
            booking process.
          </p>
        </div>
      )}
    </section>
  );
}
