import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { BookingSection } from "@/components/marketing/BookingSection";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { WhySection } from "@/components/marketing/WhySection";
import { RouteGrid } from "@/components/marketing/RouteGrid";
import { SchipholInfoCard } from "@/components/marketing/SchipholInfoCard";
import { FlightDelay } from "@/components/marketing/FlightDelay";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { VehicleShowcase } from "@/components/marketing/VehicleShowcase";
import { AmsterdamTaxi } from "@/components/marketing/AmsterdamTaxi";
import { PaymentTrust } from "@/components/marketing/PaymentTrust";
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

  // Order follows the design-system brief v2's exact visual hierarchy:
  // airport -> book -> trust -> why us -> routes -> arrival -> flight
  // delay -> how it works -> vehicles -> Amsterdam (secondary) -> payment
  // -> FAQ -> final CTA. The standalone "PopularRoute" single-route
  // callout from the previous pass is retired — its one real price now
  // lives in Hero's own floating card, and the full RouteGrid a few
  // sections down covers the rest, so keeping both would just repeat the
  // same Amsterdam<->Schiphol number a third time.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <BookingSection />
      <TrustBadges />
      <WhySection />
      <RouteGrid />
      <SchipholInfoCard />
      <FlightDelay />
      <HowItWorks />
      <VehicleShowcase />
      <AmsterdamTaxi />
      <PaymentTrust />
      <FaqTeaser />
      <FinalCta />
    </>
  );
}
