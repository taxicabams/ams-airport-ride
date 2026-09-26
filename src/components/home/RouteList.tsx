import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ROUTE_PAGES, routePageCopy } from "@/lib/routes-data";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * v9 rebuild — replaces the old 6-card `RouteGrid`/single-card
 * `PopularRoute` pair with one simple, commercial price list: "Amsterdam
 * ↔ Schiphol    Vanaf €45", one row per city, each clickable straight to
 * its real route page. Per the client's own spec: "Het moet bijna als
 * een prijslijst/route-overzicht voelen" — not a grid of cards.
 */
export async function RouteList() {
  const t = await getTranslations("Routes");
  const locale = (await getLocale()) as "nl" | "en";
  const fromSchiphol = ROUTE_PAGES.filter((r) => r.direction === "from-schiphol");

  return (
    <section id="populaire-routes" className="scroll-mt-24 mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-text">{t("eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
      </div>

      <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
        {fromSchiphol.map((route) => {
          const { city } = routePageCopy(route, locale);
          return (
            <Link
              key={route.slug}
              href={`/${route.slug}`}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-muted-background/60 focus-visible:bg-muted-background/60 focus-visible:outline-none"
            >
              <span className="font-semibold text-foreground">{city} ↔ Schiphol</span>
              <span className="flex items-center gap-2 text-brand-text">
                <span className="font-bold">{t("fixedPrice", { price: `€${route.basePrice}` })}</span>
                <ArrowRightIcon className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
