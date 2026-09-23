/**
 * Curated fixed prices for the 6 Schiphol routes this launch focuses on
 * (marketing/SEO focus, see the plan) — both directions share one price
 * since direction doesn't change the drive. This file is the single
 * source of truth: the SEO route pages (src/lib/routes-data.ts) read the
 * same numbers, so the price in the booking widget and the price in the
 * article can never drift apart.
 *
 * ⚠️ PLACEHOLDER PRICES — these are market-benchmark estimates from
 * competitor research (see the plan), not the client's real driver/fuel
 * economics. Do not treat as final; the client signs these off before
 * launch. Changing a price is a one-line edit here.
 *
 * Any pickup/destination pair NOT listed here (including plain NL
 * city-to-city rides) is priced by the transparent formula in
 * fallback.ts instead — we only have researched benchmarks for these six
 * Schiphol routes, so that's all we hardcode.
 */
export type StaticRoute = {
  /** Sorted pair of location ids from lib/locations.ts, joined by "|". */
  key: string;
  basePrice: number;
  distanceKm: number;
  durationMin: number;
};

function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}

const RAW_ROUTES: { a: string; b: string; basePrice: number; distanceKm: number; durationMin: number }[] = [
  { a: "schiphol", b: "amsterdam", basePrice: 45, distanceKm: 18, durationMin: 25 },
  { a: "schiphol", b: "amstelveen", basePrice: 40, distanceKm: 10, durationMin: 15 },
  { a: "schiphol", b: "haarlem", basePrice: 40, distanceKm: 14, durationMin: 20 },
  { a: "schiphol", b: "utrecht", basePrice: 75, distanceKm: 46, durationMin: 55 },
  { a: "schiphol", b: "rotterdam", basePrice: 95, distanceKm: 58, durationMin: 55 },
  { a: "schiphol", b: "den-haag", basePrice: 75, distanceKm: 40, durationMin: 45 },
];

export const STATIC_ROUTES: Record<string, StaticRoute> = Object.fromEntries(
  RAW_ROUTES.map(({ a, b, ...rest }) => {
    const key = pairKey(a, b);
    return [key, { key, ...rest }];
  })
);

export function findStaticRoute(
  originId: string,
  destinationId: string
): StaticRoute | undefined {
  return STATIC_ROUTES[pairKey(originId, destinationId)];
}
