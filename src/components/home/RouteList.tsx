import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ROUTE_PAGES, routePageCopy } from "@/lib/routes-data";
import { ArrowRightIcon, RouteDotIcon } from "@/components/ui/icons";
import { amsterdamPhoto } from "@/lib/amsterdamPhoto";

/**
 * Layout 4.0 — replaces v9's plain price-list rows with an actual card
 * grid ("foto / route / vanafprijs / arrow", whole card clickable, hover
 * lift), per the brief's explicit ask. Only Amsterdam has a real,
 * license-clean photo in this codebase (amsterdamPhoto.ts) — Amstelveen,
 * Haarlem, Utrecht, Rotterdam and Den Haag do not, and per the client's
 * own earlier, explicit decision this session (rejecting a generic
 * stock-photo sourcing pass), this build does not go source five more
 * stock photos for them. Rather than mix one real photo with four
 * random, inconsistent stock images (exactly what the brief's "niet
 * willekeurig verschillende stockfoto's" line warns against), every
 * card shares one deliberate always-dark navy panel + gold route-icon
 * badge language — Amsterdam's panel happens to have a real photo
 * behind it, the rest a designed gradient. Consistent, honest, and each
 * city's own real route page (with the fully written, non-generic local
 * copy) is one click away regardless.
 */
export async function RouteList() {
  const t = await getTranslations("Routes");
  const locale = (await getLocale()) as "nl" | "en";
  const fromSchiphol = ROUTE_PAGES.filter((r) => r.direction === "from-schiphol");

  return (
    <section id="populaire-routes" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-text">{t("eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("title")}</h2>
        <p className="mt-2 text-muted">{t("subtitle")}</p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {fromSchiphol.map((route) => {
          const { city } = routePageCopy(route, locale);
          const isAmsterdam = route.cityId === "amsterdam";
          return (
            <Link
              key={route.slug}
              href={`/${route.slug}`}
              className="group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-2xl p-5 shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-elevated"
            >
              {isAmsterdam ? (
                <Image
                  src={amsterdamPhoto.url}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-br from-[#17335a] to-[#0b1930]"
                />
              )}
              <div
                aria-hidden="true"
                className={`absolute inset-0 ${isAmsterdam ? "bg-gradient-to-t from-ink via-ink/55 to-ink/10" : "bg-gradient-to-t from-black/20 via-transparent to-transparent"}`}
              />

              <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                <RouteDotIcon className="h-5 w-5 text-brand" />
              </span>

              <span className="relative">
                <span className="block text-lg font-bold text-white">{city} ↔ Schiphol</span>
                <span className="mt-1 flex items-center gap-2 text-brand">
                  <span className="font-bold">{t("fixedPrice", { price: `€${route.basePrice}` })}</span>
                  <ArrowRightIcon className="h-4 w-4 transition duration-200 group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
