import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { fontVariables } from "@/lib/fonts";
import { Analytics } from "@/components/marketing/Analytics";
import { CookieConsentBanner } from "@/components/marketing/CookieConsentBanner";
import "../globals.css";

/**
 * A genuine Google Ads landing page — deliberately its OWN root layout
 * (own <html>/<body>, sibling to `[locale]/layout.tsx`, not nested under
 * it) rather than a route inside the normal site. Two real things this
 * buys, both matter for Ads Quality Score and conversion rate:
 *
 * 1. Zero distraction: no main nav, no footer link farm, nothing to
 *    click except the booking itself — someone arriving from an ad for
 *    "taxi Schiphol Amsterdam" sees exactly that, immediately.
 * 2. Real static generation: an earlier attempt used a route GROUP
 *    (`(main)`) inside `[locale]` to strip the shared chrome for just
 *    this one page — that's the "correct-looking" Next.js pattern, but
 *    testing it live (checking .next/server/app for actual prerendered
 *    .html files, not just the build's summary table) showed it broke
 *    static prerendering for every other page nested in that group,
 *    turning them all from prerendered HTML into per-request dynamic
 *    rendering. Reverted that once confirmed, in favor of this fully
 *    separate route tree, which shares no layout with `[locale]` at all
 *    and doesn't have that problem.
 *
 * Hardcoded to Dutch — the English campaign variant is a separate
 * sibling route at src/app/en/boek-taxi-schiphol (own layout, same
 * pattern), not a locale switch inside this one, so each stays a plain
 * static route with no [locale] segment involved. Reuses the *same*
 * messages/nl.json and the same components (BookingWidget, TrustBar,
 * ...) as the main site — just a manually-provided locale context
 * instead of the `[locale]` segment's middleware-driven one, via the
 * identical setRequestLocale + NextIntlClientProvider pairing used
 * there.
 *
 * Fonts come from lib/fonts.ts, not a fresh next/font/google call here —
 * calling the same Google Font loader from two separate root layouts
 * hit a real, reproducible Next.js build bug (see that file's own note).
 *
 * CookieConsentBanner is included even though it's the one piece of UI
 * besides the booking widget itself: without it, a visitor arriving here
 * straight from an ad (the whole point of this route) has no way to ever
 * grant analytics consent, so Analytics.tsx's consent check permanently
 * blocks GA4/Google Ads from firing for 100% of this page's real traffic
 * — silently breaking the exact conversion tracking this page exists to
 * feed. Found and fixed in the same pass that wired up real GA4/Ads IDs.
 */
export const metadata: Metadata = {
  title: "Boek uw taxi Schiphol — vaste prijs vanaf €35 — AMS Airport Ride",
  description:
    "Boek direct uw taxi van of naar Schiphol. Vaste prijs vooraf, geen toeslagen, betaal na de rit. Bereken uw prijs in 30 seconden.",
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://amsairportride.nl"),
  alternates: {
    canonical: "/boek-taxi-schiphol",
    languages: { nl: "/boek-taxi-schiphol", en: "/en/boek-taxi-schiphol" },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    alternateLocale: "en_US",
    siteName: "AMS Airport Ride",
  },
};

export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  setRequestLocale("nl");
  const messages = (await import("../../../messages/nl.json")).default;

  return (
    <html lang="nl" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <Analytics />
        <NextIntlClientProvider locale="nl" messages={messages}>
          {children}
          <CookieConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
