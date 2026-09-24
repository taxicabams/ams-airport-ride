import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PaymentTrust } from "@/components/marketing/PaymentTrust";
import { SchipholInfoCard } from "@/components/marketing/SchipholInfoCard";
import { RouteGrid } from "@/components/marketing/RouteGrid";
import { AmsterdamTaxi } from "@/components/marketing/AmsterdamTaxi";
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

  // Order follows the plan's evidence-based homepage structure: the
  // booking widget (inside Hero) is the primary conversion element,
  // immediately backed by trust + how-it-works, then payment/receipt
  // reassurance (right after HowItWorks' own "pay after your ride"
  // step), the Schiphol pickup info (never hidden only in the FAQ),
  // route examples, the "not going to Schiphol?" section (so it reads
  // as a natural complement right after the Schiphol-route examples,
  // not a contradiction of the Schiphol-first hero), and finally the FAQ.
  return (
    <>
      <Hero />
      <TrustBadges />
      <HowItWorks />
      <PaymentTrust />
      <SchipholInfoCard />
      <RouteGrid />
      <AmsterdamTaxi />
      <FaqTeaser />
    </>
  );
}
