import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ROUTE_PAGES, routePageCopy } from "@/lib/routes-data";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * "Vertrekbord" rebuild — an actual navy departure-board table (mono
 * font, VERTREK | REISTIJD | VASTE PRIJS columns), replacing the photo-
 * card grid from the previous Layout 4.0 pass, per the brief's exact
 * spec. Every number (price, travel time) still comes straight from the
 * real pricing engine / CANONICAL_ROUTE_FACTS — nothing invented.
 */
export async function RouteList() {
  const t = await getTranslations("Routes");
  const locale = (await getLocale()) as "nl" | "en";
  const fromSchiphol = ROUTE_PAGES.filter((r) => r.direction === "from-schiphol");

  return (
    <section id="populaire-routes" className="scroll-mt-24 mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-muted">{t("subtitle")}</p>
        </div>
        {/* "Alle plaatsen" is an overview page for a later phase (route
            pages / all-locations, per the brief's own phasing) — it
            doesn't exist yet, so no link renders here yet rather than
            point at a 404. */}
      </div>

      <div className="mt-8 overflow-hidden rounded-[18px] border border-white/10 bg-ink">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-ink-foreground-muted sm:px-7">
          <span>{t("colDeparture")}</span>
          <span className="text-right">{t("colDuration")}</span>
          <span className="text-right">{t("colPrice")}</span>
        </div>
        <div className="divide-y divide-white/10">
          {fromSchiphol.map((route) => {
            const { city } = routePageCopy(route, locale);
            return (
              <Link
                key={route.slug}
                href={`/${route.slug}`}
                className="group grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 transition duration-150 hover:bg-white/5 sm:px-7"
              >
                <span className="font-semibold text-white">{city}</span>
                <span className="text-right font-mono text-sm text-ink-foreground-muted">
                  {route.durationMin} min
                </span>
                <span className="flex items-center justify-end gap-2 text-right font-mono text-sm font-semibold text-brand">
                  {t("fixedPrice", { price: `€${route.basePrice}` })}
                  <ArrowRightIcon className="h-3.5 w-3.5 opacity-0 transition duration-150 group-hover:opacity-100" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
