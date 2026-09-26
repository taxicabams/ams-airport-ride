import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { HeroBooking } from "@/components/home/HeroBooking";
import { TrustBar } from "@/components/home/TrustBar";
import { HowItWorksSimple } from "@/components/home/HowItWorksSimple";
import { RouteList } from "@/components/home/RouteList";
import { AmsterdamEntry } from "@/components/home/AmsterdamEntry";
import { VehiclesSimple } from "@/components/home/VehiclesSimple";
import { SchipholArrival } from "@/components/home/SchipholArrival";
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

  // v9 — full frontend rebuild. The booking widget is no longer "a
  // widget somewhere on a marketing page" — it IS the hero, the first
  // thing on the page. Everything after it exists only because it adds
  // real value: one honest trust line, one compact 4-step confirmation
  // (kept because the header/footer nav link to it, not as a duplicate
  // explainer), a real price list, a genuine second entry point for
  // non-Schiphol rides, the two real vehicles, Schiphol arrival
  // practicalities, FAQ, one final CTA. No reviews section — AMS
  // Airport Ride has no real reviews yet.
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
      <AmsterdamEntry />
      <VehiclesSimple />
      <SchipholArrival />
      <FaqAccordion />
      <FinalCta />
    </>
  );
}
