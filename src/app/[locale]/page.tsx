import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { BookingSection } from "@/components/marketing/BookingSection";
import { PopularRoute } from "@/components/marketing/PopularRoute";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { RouteGrid } from "@/components/marketing/RouteGrid";
import { SchipholInfoCard } from "@/components/marketing/SchipholInfoCard";
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

  // v8 — conversion-blueprint build: same benchmarked flow as v7 (Hero ->
  // booking -> popular route -> trust -> vehicles -> how it works ->
  // Schiphol arrival -> Amsterdam-local rides -> FAQ -> route grid ->
  // final CTA), with one further consolidation per explicit client
  // feedback that the page still read as a long stack of separate
  // "cards": `FlightDelay` no longer exists as its own full-width
  // section — its one honest sentence ("we take a delay into account")
  // now lives as a single compact line inside `SchipholInfoCard`, since
  // both sections were already about the same moment (arriving at
  // Schiphol). No information lost, one fewer section boundary on the
  // page. No reviews section — AMS Airport Ride has no real reviews yet,
  // and a benchmarked competitor's trust section (star rating, license
  // badge, free-cancellation policy) doesn't carry over since none of it
  // is true here.
  //
  // Two sections from an earlier pass were already retired for the same
  // reason: `WhySection` and `PaymentTrust` restated claims ("fixed
  // price, no surprises", "pay after your ride by card or cash", "a
  // receipt is available") that already live in Hero's subtitle/trust
  // points, in `TrustBadges`' compact strip, and — in more detail — as
  // real FAQ answers.
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
      <FaqTeaser />
      <RouteGrid />
      <FinalCta />
    </>
  );
}
