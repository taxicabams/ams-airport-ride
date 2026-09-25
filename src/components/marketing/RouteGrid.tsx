import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ROUTE_PAGES, routePageCopy } from "@/lib/routes-data";

export async function RouteGrid() {
  const t = await getTranslations("Routes");
  const locale = (await getLocale()) as "nl" | "en";
  const fromSchiphol = ROUTE_PAGES.filter((r) => r.direction === "from-schiphol");

  return (
    <section id="prijzen" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
      <p className="mt-2 text-muted">{t("subtitle")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fromSchiphol.map((route) => {
          const { city } = routePageCopy(route, locale);
          return (
            <Link
              key={route.slug}
              href={`/${route.slug}`}
              className="group rounded-xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-card-hover focus-visible:-translate-y-0.5 focus-visible:border-brand/40 focus-visible:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              <p className="font-semibold text-foreground group-hover:text-brand">
                Schiphol ↔ {city}
              </p>
              <p className="mt-1 text-sm text-muted">
                {route.durationMin} min · {route.distanceKm} km
              </p>
              <p className="mt-3 text-lg font-bold text-brand">
                {t("fixedPrice", { price: `€${route.basePrice}` })}
              </p>
              <p className="mt-2 text-sm font-semibold text-brand opacity-0 transition group-hover:opacity-100">
                {t("bookRoute")}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
