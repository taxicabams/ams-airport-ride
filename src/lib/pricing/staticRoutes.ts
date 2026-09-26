/**
 * Curated fixed Personenauto base prices for Schiphol ↔ a specific NL
 * location — the client's own starting price list (see the codebase
 * memory / plan for provenance), replacing the earlier 6-city
 * placeholder table with real area-level granularity for Amsterdam and
 * a much wider set of surrounding towns/cities.
 *
 * ⚠️ NOT YET CLIENT-APPROVED — see `PRICES_APPROVED_BY_CLIENT` below.
 * Every number here is a *starting point* the client supplied, not a
 * confirmed final price. Do not present these as market facts in any
 * copy, and flag this file whenever these prices are discussed.
 *
 * Every entry here is one side of a Schiphol route — this file is
 * intentionally NOT a general city-to-city price matrix (see
 * `findStaticRoute` below): only routes touching Schiphol are curated;
 * every other NL pickup/destination pair (e.g. Utrecht → Rotterdam)
 * still goes through the transparent distance formula in fallback.ts,
 * unchanged.
 *
 * The Bus surcharge is NOT baked into these numbers — it's applied once,
 * centrally, in vehicle.ts (`BUS_SURCHARGE_EUR`), so it can never drift
 * out of sync per-route.
 */
export const PRICES_APPROVED_BY_CLIENT = false;

export type SchipholPriceEntry = {
  /** A location id from lib/locations.ts. */
  locationId: string;
  /** Personenauto base price in EUR, one-way. */
  price: number;
};

// prettier-ignore
export const SCHIPHOL_PRICES: SchipholPriceEntry[] = [
  // --- Amsterdam (generic — no specific area given; own placeholder,
  // not from the client's list, pending confirmation like everything
  // else here)
  { locationId: "amsterdam", price: 45 },

  // --- Amsterdam areas/neighborhoods
  { locationId: "sloten", price: 35 },
  { locationId: "nieuw-west-osdorp", price: 40 },
  { locationId: "de-aker-badhoevedorp", price: 40 },
  { locationId: "west", price: 45 },
  { locationId: "westerpark", price: 45 },
  { locationId: "bos-en-lommer", price: 45 },
  { locationId: "de-baarsjes", price: 45 },
  { locationId: "oud-west", price: 45 },
  { locationId: "zuid", price: 45 },
  { locationId: "de-pijp", price: 45 },
  { locationId: "rivierenbuurt", price: 45 },
  { locationId: "buitenveldert", price: 40 },
  { locationId: "zuidas", price: 40 },
  { locationId: "centrum", price: 50 },
  { locationId: "jordaan", price: 50 },
  { locationId: "grachtengordel", price: 50 },
  { locationId: "oud-zuid", price: 45 },
  { locationId: "oost", price: 50 },
  { locationId: "watergraafsmeer", price: 50 },
  { locationId: "indische-buurt", price: 50 },
  { locationId: "dapperbuurt", price: 50 },
  { locationId: "noord", price: 55 },
  { locationId: "ijburg", price: 55 },
  { locationId: "zeeburgereiland", price: 55 },
  { locationId: "zuidoost", price: 55 },
  { locationId: "bijlmer", price: 55 },
  { locationId: "arena-amstel-iii", price: 55 },
  { locationId: "gaasperdam", price: 55 },

  // --- Surrounding towns/cities
  { locationId: "amstelveen", price: 40 },
  { locationId: "zwanenburg", price: 40 },
  { locationId: "aalsmeer", price: 40 },
  { locationId: "hoofddorp", price: 35 },
  { locationId: "halfweg", price: 40 },
  { locationId: "diemen", price: 45 },
  { locationId: "ouderkerk-aan-de-amstel", price: 45 },
  { locationId: "abcoude", price: 50 },
  { locationId: "weesp", price: 55 },
  { locationId: "uithoorn", price: 50 },
  { locationId: "haarlem", price: 50 },
  { locationId: "heemstede", price: 50 },
  { locationId: "bloemendaal", price: 55 },
  { locationId: "aerdenhout", price: 55 },
  { locationId: "velsen", price: 60 },
  { locationId: "ijmuiden", price: 60 },
  { locationId: "zaandam", price: 55 },
  { locationId: "wormerveer", price: 60 },
  { locationId: "purmerend", price: 60 },
  { locationId: "alkmaar", price: 75 },
  { locationId: "beverwijk", price: 65 },
  { locationId: "hoorn", price: 80 },
  { locationId: "almere-stad", price: 80 },
  { locationId: "almere-buiten", price: 85 },
  { locationId: "almere-haven", price: 80 },
  { locationId: "lelystad", price: 105 },
  { locationId: "utrecht", price: 80 },
  { locationId: "maarssen", price: 70 },
  { locationId: "breukelen", price: 65 },
  { locationId: "nieuwegein", price: 75 },
  { locationId: "zeist", price: 85 },
  { locationId: "hilversum", price: 75 },
  { locationId: "amersfoort", price: 95 },
  { locationId: "leiden", price: 70 },
  { locationId: "alphen-aan-den-rijn", price: 65 },
  { locationId: "den-haag", price: 85 },
  { locationId: "delft", price: 85 },
  { locationId: "zoetermeer", price: 85 },
  { locationId: "gouda", price: 90 },
  { locationId: "rotterdam", price: 115 },
  { locationId: "dordrecht", price: 125 },
];

const SCHIPHOL_PRICE_BY_LOCATION: Map<string, number> = new Map(
  SCHIPHOL_PRICES.map((entry) => [entry.locationId, entry.price])
);

/**
 * The cheapest real fixed Schiphol price in the curated table above —
 * used for the homepage hero's "Fixed price from €X" line so that
 * number can never drift out of sync with the actual price list (no
 * hand-typed duplicate of a number that already lives here).
 */
export const CHEAPEST_SCHIPHOL_PRICE = Math.min(...SCHIPHOL_PRICES.map((entry) => entry.price));

export function findSchipholPrice(locationId: string): number | undefined {
  return SCHIPHOL_PRICE_BY_LOCATION.get(locationId);
}

/**
 * The only pairs with a curated fixed price are Schiphol ↔ X — anything
 * else (including plain city-to-city rides) returns undefined and falls
 * through to the fallback formula, unchanged.
 */
export function findStaticRoute(
  originId: string,
  destinationId: string
): { basePrice: number } | undefined {
  const otherSide =
    originId === "schiphol" && destinationId !== "schiphol"
      ? destinationId
      : destinationId === "schiphol" && originId !== "schiphol"
        ? originId
        : undefined;

  if (!otherSide) return undefined;

  const basePrice = findSchipholPrice(otherSide);
  return basePrice !== undefined ? { basePrice } : undefined;
}

/**
 * Distance/duration for the 6 hand-authored SEO route pages
 * (lib/routes-data.ts) — kept separate from price on purpose (see the
 * file header): these numbers come from the earlier competitor-informed
 * research in the plan, not from the client's price list, and are
 * unaffected by future price changes above.
 */
export const CANONICAL_ROUTE_FACTS: Record<
  string,
  { distanceKm: number; durationMin: number }
> = {
  amsterdam: { distanceKm: 18, durationMin: 25 },
  amstelveen: { distanceKm: 10, durationMin: 15 },
  haarlem: { distanceKm: 14, durationMin: 20 },
  utrecht: { distanceKm: 46, durationMin: 55 },
  rotterdam: { distanceKm: 58, durationMin: 55 },
  "den-haag": { distanceKm: 40, durationMin: 45 },
};
