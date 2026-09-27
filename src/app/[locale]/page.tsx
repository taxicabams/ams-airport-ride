import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroBooking } from "@/components/home/HeroBooking";
import { TrustBar } from "@/components/home/TrustBar";
import { HowItWorksSimple } from "@/components/home/HowItWorksSimple";
import { VehiclesSimple } from "@/components/home/VehiclesSimple";
import { TwoColumnBanner } from "@/components/home/TwoColumnBanner";
import { RouteList } from "@/components/home/RouteList";
import { Reviews } from "@/components/home/Reviews";
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
  // companyInfo.ts's phone/address/etc. are all preview placeholders
  // (see that file's own header note) — a LocalBusiness/TaxiService
  // schema must never invent a telephone/address/aggregateRating just
  // because the type usually has one, so this still leaves those out
  // entirely rather than emit the "1234567"-style preview values as
  // structured data. Revisit once real values replace the placeholders.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "AMS Airport Ride",
    url: siteUrl,
    description: t("description"),
    areaServed: ["Amsterdam", "Schiphol", "Nederland"],
  };

  // Route price table moved right after the hero per direct feedback
  // ("die tabel met vaste prijzen... gelijk duidelijk bovenaan ergens
  // bij booking vak") — was much further down the page.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroBooking />
      <RouteList />
      <TrustBar />
      <HowItWorksSimple />
      <VehiclesSimple />
      <TwoColumnBanner />
      <Reviews />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
