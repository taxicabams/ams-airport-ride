import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { fontVariables } from "@/lib/fonts";
import { TopBar } from "@/components/home/TopBar";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { StickyMobileCta } from "@/components/marketing/StickyMobileCta";
import { WhatsAppButton } from "@/components/marketing/WhatsAppButton";
import { Analytics } from "@/components/marketing/Analytics";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });
  // og:locale/og:type were missing entirely (Next.js only auto-derives
  // og:title/description/image from the plain fields above, not these) -
  // real, if minor, SEO/social-share gap: without it, a share on
  // Facebook/LinkedIn can't tell this is a Dutch vs. English page.
  const ogLocale = locale === "en" ? "en_US" : "nl_NL";
  const ogAlternateLocale = locale === "en" ? "nl_NL" : "en_US";
  return {
    title: { default: t("title"), template: `%s — AMS Airport Ride` },
    description: t("description"),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://amsairportride.nl"
    ),
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: ogAlternateLocale,
      siteName: "AMS Airport Ride",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Tells next-intl which locale this request/render is for, so
  // server-only APIs like getTranslations() elsewhere in the tree don't
  // need the locale passed down manually. See i18n/request.ts.
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Analytics />
        <NextIntlClientProvider messages={messages}>
          <TopBar />
          <Header />
          {/* pb-16 clears the fixed StickyMobileCta bar on small screens
              (md:pb-0 once that bar hides itself) so it never overlaps
              the footer or a page's last content. */}
          <main className="flex-1 pb-16 md:pb-0">{children}</main>
          <Footer />
          <StickyMobileCta />
          <WhatsAppButton />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
