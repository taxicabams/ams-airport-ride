import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroBooking } from "@/components/home/HeroBooking";
import { TrustBar } from "@/components/home/TrustBar";
import { ComparisonSection } from "@/components/marketing/ComparisonSection";
import { HowItWorksSimple } from "@/components/home/HowItWorksSimple";
import { VehiclesSimple } from "@/components/home/VehiclesSimple";
import { TwoColumnBanner } from "@/components/home/TwoColumnBanner";
import { RouteList } from "@/components/home/RouteList";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { Reviews } from "@/components/home/Reviews";
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amsairportride.nl";

  // Deliberately minimal: only fields that are actually true today.
  // companyInfo.ts's phone/address/etc. are all null until the client
  // supplies real values (see that file's own header note) — a
  // LocalBusiness/TaxiService schema must never invent a telephone/
  // address/aggregateRating just because the type usually has one, so
  // this leaves those out entirely rather than fabricate them. Revisit
  // once the client supplies real values.
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
  //
  // Reviews re-added: Reviews.tsx itself now renders nothing at all
  // while there are zero published reviews (see that file's own note),
  // so this is safe to mount permanently — the "coming soon" problem
  // that got it removed earlier is fixed at the component level, not by
  // conditionally including it here. It'll start appearing on its own
  // the moment the first real review is approved.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroBooking />
      <RouteList />
      <TrustBar />
      <ComparisonSection locale={locale as "nl" | "en"} />
      <HowItWorksSimple />
      <VehiclesSimple />
      <TwoColumnBanner />
      <FaqAccordion />
      <Reviews />
      <FinalCta />
    </>
  );
}
