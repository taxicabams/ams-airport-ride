import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing/staticRoutes";
import { AmsterdamSkyline } from "./AmsterdamSkyline";
import { HeroRouteMotif } from "./HeroRouteMotif";
import { FlightPathDivider } from "./FlightPathDivider";

/**
 * v5 conversion pass: within a couple of seconds a visitor must see
 * what (Schiphol taxi), the real "from" price, and one clear CTA — no
 * competing trust list. The "from €X" price is the real minimum from
 * the curated Schiphol price table (staticRoutes.ts), never a
 * hand-typed number, and honestly framed as "from" since Amsterdam-area
 * prices vary by neighborhood. The one compact trust line below the CTA
 * replaces the previous 4-badge checkmark list plus a separate "no
 * online payment" line — the same facts, said once, since TrustBadges
 * further down the page already covers this in more detail; repeating
 * it here as a second full list was exactly the duplicate-messaging
 * problem this pass is meant to fix.
 *
 * Two-column layout (text+CTA left, a visual right) unchanged from v2 —
 * the booking widget lives in its own BookingSection right below,
 * pulled up to overlap this section's bottom edge on desktop (see
 * page.tsx). No real "premium sedan at Schiphol" photo exists yet (see
 * heroVisual.ts's comment on why one wasn't faked), so the right column
 * stays the original route-line/skyline illustration, with a floating
 * "Schiphol → Amsterdam / From €45" card overlaid — the exact same real
 * price PopularRoute shows elsewhere, never a separately hardcoded
 * number.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const tRoute = await getTranslations("PopularRoute");

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {t("eyebrow")}
          </p>
          {/* The brand's small recurring "flight path" motif — used
              sparingly (here, on route cards, and as email-safe text in
              email.ts) so it reads as a signature rather than decoration
              repeated everywhere. */}
          <FlightPathDivider from="AMS" to="SCHIPHOL" className="mt-3 max-w-xs" />
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          {/* The real, honest "from" price — the single largest text
              element after the H1, deliberately placed before the
              softer subtitle so a visitor sees a concrete number within
              the first couple of seconds. */}
          <p className="mt-3 text-3xl font-bold tracking-tight text-brand sm:text-4xl">
            {t("heroPrice", { price: CHEAPEST_SCHIPHOL_PRICE })}
          </p>
          <p className="mt-3 text-lg font-medium text-foreground/90">{t("subtitle")}</p>
          <p className="mt-2 max-w-md text-base text-muted">{t("supportingText")}</p>

          <Link
            href="/#boeken"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark"
          >
            {t("ctaPrimary")}
          </Link>
          <p className="mt-3 text-sm font-medium text-muted">{t("compactTrustLine")}</p>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-brand-light to-surface shadow-elevated">
            <AmsterdamSkyline className="pointer-events-none absolute inset-x-0 bottom-0 h-14 w-full text-brand/10" />
            <HeroRouteMotif className="pointer-events-none absolute inset-0 h-full w-full text-brand/20" />
          </div>

          {/* Floating "route ticket" card — the brief's own "SCHIPHOL ->
              AMSTERDAM / From €45" overlay, sourced from PopularRoute's
              translations so this can never disagree with the real price
              shown a section further down. */}
          <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border bg-surface p-4 shadow-elevated sm:right-auto sm:min-w-[220px]">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t("floatingCardRoute")}
            </p>
            <p className="mt-1 text-2xl font-bold text-brand">{tRoute("price")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
