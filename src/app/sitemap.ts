import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { ROUTE_PAGES } from "@/lib/routes-data";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amsairportride.nl";

const STATIC_PATHS = [
  "/",
  "/over-ons",
  "/contact",
  "/veelgestelde-vragen",
  "/privacy",
  "/voorwaarden",
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

  return [...staticEntries, ...routeEntries];
}
