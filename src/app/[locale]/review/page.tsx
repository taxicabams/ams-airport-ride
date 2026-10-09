import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ReviewForm } from "@/components/marketing/ReviewForm";
import { buildAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base =
    locale === "nl"
      ? { title: "Beoordeling achterlaten", description: "Vertel ons hoe uw rit met AMS Airport Ride was." }
      : { title: "Leave a review", description: "Tell us how your ride with AMS Airport Ride went." };
  return {
    ...base,
    // Not meant to rank/be discovered via search — this is a link only
    // ever handed out directly (the review-request email), and a public
    // open-submission page indexed by Google is an easy target for spam
    // reviews that would then sit in the moderation queue for no reason.
    robots: { index: false, follow: false },
    alternates: buildAlternates(locale as AppLocale, "/review"),
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <section className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <ReviewForm />
    </section>
  );
}
