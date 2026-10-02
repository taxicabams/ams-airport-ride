import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ROUTE_PAGES, routePageCopy } from "@/lib/routes-data";
import { findSchipholPrice, CANONICAL_ROUTE_FACTS } from "@/lib/pricing/staticRoutes";
import { estimateDistanceDuration } from "@/lib/pricing/fallback";
import { LOCATIONS } from "@/lib/locations";
import { ArrowRightIcon } from "@/components/ui/icons";

const SCHIPHOL_LOCATION = LOCATIONS.find((l) => l.id === "schiphol")!;

/**
 * Amsterdam broken into its 5 districts (per direct feedback: "west
 * zuid oost centrum noord... dat in tabel"), plus Heemstede — none of
 * these have a dedicated route page yet, so each links straight to the
 * booking widget instead of a "/${slug}" page that doesn't exist.
 * Prices are the client's own real, already-curated Schiphol price list
 * (lib/pricing/staticRoutes.ts's SCHIPHOL_PRICES) — the exact same
 * numbers the booking engine would already quote for these locations
 * today, never a separately invented figure. Duration is computed with
 * the app's own real distance/duration formula (fallback.ts) from each
 * location's real coordinates (lib/locations.ts) when no hand-
 * researched CANONICAL_ROUTE_FACTS entry exists for it.
 *
 * "sloten" (Amsterdam-Sloten, the neighborhood bordering Schiphol) is
 * listed FIRST and deliberately: it's the one real curated route that
 * actually prices at €35 — the exact number the hero badge advertises
 * ("Vaste prijs vanaf €35"). Before this, the visible table's cheapest
 * row was Amstelveen at €40, so a visitor saw the hero's €35 claim
 * immediately contradicted by the very next thing on the page — a real
 * trust/credibility gap, not just a cosmetic one. This isn't a new or
 * invented price; it was already in SCHIPHOL_PRICES and already the
 * source of CHEAPEST_SCHIPHOL_PRICE (used by the hero badge) — it just
 * wasn't previously surfaced in this summary table.
 */
const EXTRA_LOCATION_IDS = ["sloten", "west", "zuid", "oost", "centrum", "noord", "heemstede"] as const;

const EXTRA_LABELS: Record<(typeof EXTRA_LOCATION_IDS)[number], { nl: string; en: string }> = {
  sloten: { nl: "Amsterdam Sloten", en: "Amsterdam Sloten" },
  west: { nl: "Amsterdam West", en: "Amsterdam West" },
  zuid: { nl: "Amsterdam Zuid", en: "Amsterdam South" },
  oost: { nl: "Amsterdam Oost", en: "Amsterdam East" },
  centrum: { nl: "Amsterdam Centrum", en: "Amsterdam Centre" },
  noord: { nl: "Amsterdam Noord", en: "Amsterdam North" },
  heemstede: { nl: "Heemstede", en: "Heemstede" },
};

function extraRow(id: (typeof EXTRA_LOCATION_IDS)[number], locale: "nl" | "en") {
  const location = LOCATIONS.find((l) => l.id === id)!;
  const price = findSchipholPrice(id)!;
  const facts = CANONICAL_ROUTE_FACTS[id] ?? estimateDistanceDuration(SCHIPHOL_LOCATION, location);
  return { key: id, city: EXTRA_LABELS[id][locale], durationMin: facts.durationMin, price, href: "/#boeken" as const };
}

export async function RouteList() {
  const t = await getTranslations("Routes");
  const locale = (await getLocale()) as "nl" | "en";

  // Keep the existing hand-authored, full-content route pages for the
  // other real destinations (Amstelveen, Haarlem, Utrecht, Rotterdam,
  // Den Haag) — only the generic single "Amsterdam" row is dropped,
  // superseded by its 5 real districts above. Zandvoort is also
  // excluded: this whole table is explicitly labeled "Vaste prijs"
  // (see messages/*.json's Routes.colPrice/subtitle) and Zandvoort's
  // route.basePrice is a distance-based estimate, not a curated fixed
  // price (routes-data.ts's isEstimate) — it still has its own real,
  // reachable route page (for search/ads traffic), just not a row in a
  // table that promises "fixed" for every price shown.
  const pageRows = ROUTE_PAGES.filter(
    (r) => r.direction === "from-schiphol" && r.cityId !== "amsterdam" && !r.isEstimate
  ).map((route) => {
    const { city } = routePageCopy(route, locale);
    return { key: route.slug, city, durationMin: route.durationMin, price: route.basePrice, href: `/${route.slug}` };
  });

  const districtRows = EXTRA_LOCATION_IDS.filter((id) => id !== "heemstede").map((id) => extraRow(id, locale));
  const heemstedeRow = extraRow("heemstede", locale);

  // Amsterdam's 5 districts first, then the immediate Amsterdam-area
  // towns (Amstelveen/Haarlem/Heemstede/Hoofddorp/Zaandam — the client's
  // own named secondary markets, all genuinely close to Schiphol), then
  // the further-out cities (Utrecht/Rotterdam/Den Haag).
  const NEARBY_KEYS = [
    "taxi-schiphol-amstelveen",
    "taxi-schiphol-haarlem",
    "taxi-schiphol-hoofddorp",
    "taxi-schiphol-zaandam",
  ];
  const rows = [
    ...districtRows,
    ...pageRows.filter((r) => NEARBY_KEYS.includes(r.key)),
    heemstedeRow,
    ...pageRows.filter((r) => !NEARBY_KEYS.includes(r.key)),
  ];

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
      </div>

      <div className="mt-8 overflow-hidden rounded-[18px] border border-white/10 bg-ink">
        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-ink-foreground-muted sm:px-7">
          <span>{t("colDeparture")}</span>
          <span className="text-right">{t("colDuration")}</span>
          <span className="text-right">{t("colPrice")}</span>
        </div>
        <div className="divide-y divide-white/10">
          {rows.map((row) => (
            <Link
              key={row.key}
              href={row.href}
              className="group grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 transition duration-150 hover:bg-white/5 sm:px-7"
            >
              <span className="font-semibold text-white">{row.city}</span>
              <span className="text-right font-mono text-sm text-ink-foreground-muted">
                {row.durationMin} min
              </span>
              <span className="flex items-center justify-end gap-2 text-right font-mono text-sm font-semibold text-brand">
                {t("fixedPrice", { price: `€${row.price}` })}
                <ArrowRightIcon className="h-3.5 w-3.5 opacity-0 transition duration-150 group-hover:opacity-100" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
