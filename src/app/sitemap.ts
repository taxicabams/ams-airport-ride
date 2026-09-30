import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { ROUTE_PAGES } from "@/lib/routes-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://amsairportride.nl";

const STATIC_PATHS = [
  "/",
  "/over-ons",
  "/contact",
  "/veelgestelde-vragen",
  "/privacy",
  "/voorwaarden",
  // Real gap found live during the final release audit: /cookies was
  // added (src/app/[locale]/cookies/page.tsx) but this list is
  // hardcoded, not auto-discovered from the filesystem — it silently
  // stayed out of the sitemap until added here explicitly.
  "/cookies",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}${getPathname({ locale, href: path })}`,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${SITE_URL}${getPathname({ locale: l, href: path })}`])
        ),
      },
    }))
  );

  const routeEntries = ROUTE_PAGES.flatMap((route) =>
    routing.locales.map((locale) => {
      // Plain string, not {pathname, params} — see the note in the
      // [slug] page's generateMetadata for why.
      const href = `/${route.slug}`;
      return {
        url: `${SITE_URL}${getPathname({ locale, href })}`,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE_URL}${getPathname({ locale: l, href })}`])
          ),
        },
      };
    })
  );

  // The Ads landing pages (src/app/boek-taxi-schiphol,
  // src/app/en/boek-taxi-schiphol) live outside the [locale] segment
  // entirely (see those routes' own layout.tsx notes), so getPathname
  // can't resolve them — real gap found live: they were missing from
  // this sitemap entirely. Hardcoded here since there are only two and
  // their paths never change.
  const landingEntries = [
    {
      url: `${SITE_URL}/boek-taxi-schiphol`,
      alternates: {
        languages: {
          nl: `${SITE_URL}/boek-taxi-schiphol`,
          en: `${SITE_URL}/en/boek-taxi-schiphol`,
        },
      },
    },
    {
      url: `${SITE_URL}/en/boek-taxi-schiphol`,
      alternates: {
        languages: {
          nl: `${SITE_URL}/boek-taxi-schiphol`,
          en: `${SITE_URL}/en/boek-taxi-schiphol`,
        },
      },
    },
  ];

  return [...staticEntries, ...routeEntries, ...landingEntries];
}
