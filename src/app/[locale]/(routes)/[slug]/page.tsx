import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { ROUTE_PAGES, getRoutePage, routePageCopy } from "@/lib/routes-data";
import { BookingWidget } from "@/components/booking/BookingWidget";

type Locale = "nl" | "en";

// Same fallback convention as sitemap.ts/robots.ts — BreadcrumbList's
// `item` must be an absolute URL per schema.org (a relative one fails
// Google's Rich Results validation), so this can't reuse getPathname()
// alone the way in-app links do.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amsairportride.nl";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ROUTE_PAGES.map((route) => ({ locale, slug: route.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const route = getRoutePage(slug);
  if (!route) return {};

  const { title, description } = routePageCopy(route, locale as Locale);
  // Built as a plain string (not the {pathname, params} object form) —
  // that form only substitutes params when routing.ts defines a
  // `pathnames` map, which we don't have; without one, next-intl's
  // getPathname takes a literal path, so we interpolate the slug
  // ourselves.
  const pathname = `/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: getPathname({ locale: locale as Locale, href: pathname }),
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, getPathname({ locale: l, href: pathname })])
      ),
    },
    openGraph: { title, description },
  };
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const route = getRoutePage(slug);
  if (!route) notFound();

  const l = locale as Locale;
  const { title, intro, city } = routePageCopy(route, l);
  const t = await getTranslations("Booking");
  const localCopy = route.content.local[l];
  const faq = route.content.faq[l];
  // Same literal generateMetadata builds — see the note there on why
  // this isn't the {pathname, params} object form.
  const pathname = `/${slug}`;

  const pickupValue = route.direction === "from-schiphol" ? "Schiphol Airport" : city;
  const destinationValue = route.direction === "from-schiphol" ? city : "Schiphol Airport";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: title,
        areaServed: "NL",
        provider: { "@type": "LocalBusiness", name: "AMS Airport Ride" },
        offers: { "@type": "Offer", price: route.basePrice, priceCurrency: "EUR" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: `${SITE_URL}${getPathname({ locale: l, href: "/" })}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: `${SITE_URL}${getPathname({ locale: l, href: pathname })}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted">{intro}</p>

          <dl className="mt-6 grid grid-cols-3 gap-4 rounded-xl border border-border p-4 text-center">
            <div>
              <dt className="text-xs text-muted">
                {l === "nl" ? "Vaste prijs" : "Fixed price"}
              </dt>
              <dd className="mt-1 text-xl font-bold text-brand">€{route.basePrice}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">{l === "nl" ? "Afstand" : "Distance"}</dt>
              <dd className="mt-1 text-xl font-bold text-foreground">{route.distanceKm} km</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">
                {l === "nl" ? "Reistijd" : "Travel time"}
              </dt>
              <dd className="mt-1 text-xl font-bold text-foreground">
                {route.durationMin} min
              </dd>
            </div>
          </dl>

          <p className="mt-6 text-foreground/90">{localCopy}</p>

          <h2 className="mt-8 text-xl font-bold text-foreground">
            {l === "nl" ? "Veelgestelde vragen" : "Frequently asked questions"}
          </h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border">
            {faq.map((item) => (
              <details key={item.q} className="group p-4">
                <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-muted transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <p className="mb-3 text-center text-sm font-medium text-muted lg:hidden">
            {t("heading")}
          </p>
          <BookingWidget initialPickup={pickupValue} initialDestination={destinationValue} />
        </div>
      </section>
    </>
  );
}
