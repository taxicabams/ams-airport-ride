import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { PopularRoute } from "@/components/marketing/PopularRoute";
import { AmsterdamTaxi } from "@/components/marketing/AmsterdamTaxi";
import { PaymentTrust } from "@/components/marketing/PaymentTrust";
import { VehicleShowcase } from "@/components/marketing/VehicleShowcase";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { SchipholInfoCard } from "@/components/marketing/SchipholInfoCard";
import { RouteGrid } from "@/components/marketing/RouteGrid";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";
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

  // Order follows the client's commercial priority list: the booking
  // widget (inside Hero) plus the "from €35" price message first, then
  // the single most concrete number a visitor from Amsterdam wants
  // (PopularRoute's "Amsterdam <-> Schiphol from €45"), then "not just
  // Schiphol" (AmsterdamTaxi) and payment/receipt reassurance, the
  // vehicle visual + capacity summary, trust badges, how-it-works, the
  // Schiphol pickup info (never hidden only in the FAQ), route examples,
  // and finally the FAQ.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <PopularRoute />
      <AmsterdamTaxi />
      <PaymentTrust />
      <VehicleShowcase />
      <TrustBadges />
      <HowItWorks />
      <SchipholInfoCard />
      <RouteGrid />
      <FaqTeaser />
    </>
  );
}
