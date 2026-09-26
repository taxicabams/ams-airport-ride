import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroBooking } from "@/components/home/HeroBooking";
import { TrustBar } from "@/components/home/TrustBar";
import { HowItWorksSimple } from "@/components/home/HowItWorksSimple";
import { RouteList } from "@/components/home/RouteList";
import { TwoColumnBanner } from "@/components/home/TwoColumnBanner";
import { VehiclesSimple } from "@/components/home/VehiclesSimple";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { FinalCta } from "@/components/home/FinalCta";
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

  // v10 — full visual rebuild per the client's photo-hero mockup: a
  // real background-photo hero with the booking card overlapping its
  // bottom edge, then trust row → how-it-works (kept: the header/footer
  // nav still link to #hoe-het-werkt) → price list → one combined
  // Amsterdam/Schiphol photo-banner section (replaces two separate
  // plain-text sections) → vehicles → FAQ → final CTA. No reviews
  // section — AMS Airport Ride has no real reviews yet.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroBooking />
      <TrustBar />
      <HowItWorksSimple />
      <RouteList />
      <TwoColumnBanner />
      <VehiclesSimple />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
