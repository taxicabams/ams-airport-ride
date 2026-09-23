import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/marketing/Hero";
import { TrustBadges } from "@/components/marketing/TrustBadges";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { SchipholInfoCard } from "@/components/marketing/SchipholInfoCard";
import { RouteGrid } from "@/components/marketing/RouteGrid";
import { FaqTeaser } from "@/components/marketing/FaqTeaser";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Order follows the plan's evidence-based homepage structure: the
  // booking widget (inside Hero) is the primary conversion element,
  // immediately backed by trust + how-it-works, then the Schiphol
  // pickup info (never hidden only in the FAQ), route examples, and
  // finally the FAQ.
  return (
    <>
      <Hero />
      <TrustBadges />
      <HowItWorks />
      <SchipholInfoCard />
      <RouteGrid />
      <FaqTeaser />
    </>
  );
}
