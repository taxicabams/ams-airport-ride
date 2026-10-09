import type { Metadata } from "next";
import { Suspense } from "react";
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
      {/* ReviewForm reads the ?rating= query param (useSearchParams) to
          pre-select a star rating from the request email's 1-tap links
          — that hook requires a Suspense boundary so the rest of this
          route can still prerender statically (see Analytics.tsx's own
          precedent this session for the cost of getting a similar
          dynamic-API tradeoff wrong). No fallback UI needed: this
          resolves on the client essentially instantly, well before a
          visitor could perceive a blank state. */}
      <Suspense>
        <ReviewForm />
      </Suspense>
    </section>
  );
}
