import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { BookingSection } from "@/components/marketing/BookingSection";
import { PopularRoute } from "@/components/marketing/PopularRoute";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { RouteGrid } from "@/components/marketing/RouteGrid";
import { SchipholInfoCard } from "@/components/marketing/SchipholInfoCard";
import { FlightDelay } from "@/components/marketing/FlightDelay";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { VehicleShowcase } from "@/components/marketing/VehicleShowcase";
import { AmsterdamTaxi } from "@/components/marketing/AmsterdamTaxi";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";
import { FinalCta } from "@/components/marketing/FinalCta";
import { buildAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";

// Title/description themselves come from the layout's generateMetadata
// (the Metadata namespace) — this only adds what the layout can't: a
// per-locale canonical URL and hreflang alternates for "/".
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: buildAlternates(locale as AppLocale, "/") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Metadata");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amsairportride.nl";

  // Deliberately minimal: only fields that are actually true today.
  // companyInfo.ts's phone/address/reviews are all still null (no real
  // data confirmed yet) — a LocalBusiness/TaxiService schema must never
  // invent a telephone, street address, or aggregateRating just because
  // the type usually has one. priceRange is left out for the same reason
  // (it would need to track the pricing engine to stay accurate, and a
  // stale number is worse than none). See companyInfo.ts's own
  // null-until-real convention.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "AMS Airport Ride",
    url: siteUrl,
    description: t("description"),
    areaServed: ["Amsterdam", "Schiphol", "Nederland"],
  };

  // v7 — commercial flow benchmarked against schipholride.nl's proven
  // structure (analysed live, never copied): Hero -> booking (the
  // product) -> a concrete popular-route price example -> one compact
  // trust strip -> vehicles -> how it works -> Schiphol arrival +
  // Amsterdam-local rides (secondary use case) -> FAQ -> the full route
  // grid -> one final CTA. No reviews section — AMS Airport Ride has no
  // real reviews yet, and a benchmarked competitor's trust section
  // (star rating, license badge, free-cancellation policy) doesn't
  // carry over since none of it is true here.
  //
  // Two sections from an earlier pass are deliberately retired, not
  // just reordered: `WhySection` and `PaymentTrust` restated claims
  // ("fixed price, no surprises", "pay after your ride by card or cash",
  // "a receipt is available") that already live in Hero's subtitle/trust
  // points, in `TrustBadges`' compact strip, and — in more detail — as
  // real FAQ answers ("Wanneer betaal ik?", "Krijg ik een bon?", "Hoe
  // wordt mijn prijs bepaald?"). Keeping them as whole extra sections was
  // exactly the repeated-messaging problem the client asked to fix; no
  // information is lost, since every real fact they contained is still
  // said once, in the place it's most useful.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <BookingSection />
      <PopularRoute />
      <TrustBadges />
      <VehicleShowcase />
      <HowItWorks />
      <SchipholInfoCard />
      <AmsterdamTaxi />
      <FlightDelay />
      <FaqTeaser />
      <RouteGrid />
      <FinalCta />
    </>
  );
}
