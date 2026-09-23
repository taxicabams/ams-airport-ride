import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ROUTE_PAGES, routePageCopy } from "@/lib/routes-data";

export async function RouteGrid() {
  const t = await getTranslations("Routes");
  const locale = (await getLocale()) as "nl" | "en";
  const fromSchiphol = ROUTE_PAGES.filter((r) => r.direction === "from-schiphol");

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="mt-1 text-muted">{t("subtitle")}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fromSchiphol.map((route) => {
          const { city } = routePageCopy(route, locale);
          return (
            <Link
              key={route.slug}
              href={`/${route.slug}`}
              className="group rounded-xl border border-border p-5 transition hover:border-brand hover:shadow-sm"
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
            </Link>
          );
        })}
      </div>
    </section>
  );
}
