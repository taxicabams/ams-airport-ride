import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { fontVariables } from "@/lib/fonts";
import { Analytics } from "@/components/marketing/Analytics";
import "../../globals.css";

/**
 * English sibling of `src/app/boek-taxi-schiphol` — same reasoning as
 * that file's own note (own root layout, own <html>/<body>, outside
 * `[locale]` to avoid the route-group static-generation bug and keep
 * the page distraction-free for Ads traffic). Lives at a static `/en`
 * segment, which Next.js resolves ahead of the `[locale]` dynamic
 * segment at the same level — same precedence the real `/en/...` site
 * pages already rely on being reachable at all alongside this route.
 */
export const metadata: Metadata = {
  title: "Book your Schiphol taxi — fixed price from €35 — AMS Airport Ride",
  description:
    "Book your taxi to or from Schiphol directly. Fixed price upfront, no surcharges, pay after your ride. Get your price in 30 seconds.",
  robots: { index: true, follow: true },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://amsairportride.nl"),
  alternates: {
    canonical: "/en/boek-taxi-schiphol",
    languages: { nl: "/boek-taxi-schiphol", en: "/en/boek-taxi-schiphol" },
  },
};

export default async function LandingLayoutEn({ children }: { children: React.ReactNode }) {
  setRequestLocale("en");
  const messages = (await import("../../../../messages/en.json")).default;

  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <Analytics />
        <NextIntlClientProvider locale="en" messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
