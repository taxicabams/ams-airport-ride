import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CheckIcon } from "@/components/ui/icons";
import { AmsterdamSkyline } from "./AmsterdamSkyline";
import { HeroRouteMotif } from "./HeroRouteMotif";

/**
 * Design-system brief v2: two-column hero (text+CTA left, a visual right)
 * instead of the calculator sitting beside the text — the booking widget
 * now lives in its own BookingSection right below, pulled up to overlap
 * this section's bottom edge on desktop (see page.tsx). No real "premium
 * sedan at Schiphol" photo exists yet (see heroVisual.ts's comment on why
 * one wasn't faked), so the right column stays the original route-line/
 * skyline illustration, with a floating "Schiphol → Amsterdam / From €45"
 * card overlaid — the exact same real price PopularRoute shows elsewhere,
 * never a separately hardcoded number.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const tRoute = await getTranslations("PopularRoute");

  const trustPoints = [t("trustPoint1"), t("trustPoint2"), t("trustPoint3"), t("trustPoint4")];

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-xl font-semibold text-foreground/90">{t("subtitle")}</p>
          <p className="mt-3 max-w-md text-base text-muted">{t("supportingText")}</p>

          <Link
            href="/#boeken"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark"
          >
            {t("ctaPrimary")}
          </Link>
          <p className="mt-2.5 text-sm text-muted">{t("noOnlinePayment")}</p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-foreground/80">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
                {point}
              </li>
            ))}
          </ul>
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
