import { routing, type AppLocale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";

/**
 * Canonical + hreflang alternates for a page, in the exact shape
 * Metadata.alternates expects. Every locale-aware page should set this —
 * without it, Google has no signal for which URL is canonical or which
 * locale variants are equivalent, which the [slug] route pages already
 * did (see their generateMetadata) but the static pages didn't.
 *
 * `href` is a plain path (e.g. "/contact"), not the {pathname, params}
 * object form — we don't use next-intl's `pathnames` map (see routing.ts),
 * so getPathname takes a literal path and only adds the /en prefix.
 */
export function buildAlternates(locale: AppLocale, href: string) {
  return {
    canonical: getPathname({ locale, href }),
    languages: Object.fromEntries(
      routing.locales.map((l) => [l, getPathname({ locale: l, href })])
    ),
  };
}
