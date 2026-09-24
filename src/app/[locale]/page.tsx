import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
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
