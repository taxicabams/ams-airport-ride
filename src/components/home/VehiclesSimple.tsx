import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  PERSONENAUTO_MAX_PASSENGERS,
  PERSONENAUTO_MAX_LUGGAGE,
  BUS_MAX_PASSENGERS,
  BUS_MAX_LUGGAGE,
  BUS_SURCHARGE_EUR,
} from "@/lib/pricing/vehicle";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";

/**
 * Second redesign of this section's vehicle cards (see git history for
 * the first: a stock-photo pass, then a hand-drawn-icon-on-gradient
 * pass). Direct feedback on the icon version: still reads as a generic
 * placeholder ("dat getekende autotje") — the same underlying problem
 * as the photos, just one level more abstract.
 *
 * Researched how competitors solve this (SchipholRide's own vehicle
 * section, live on schipholride.nl): they use NO image or icon at all —
 * a bold color-block card naming the vehicle CLASS plus a real example
 * model ("Volkswagen Passat of soortgelijk"), capacity, luggage and
 * price, nothing else. That sidesteps the whole "does this picture
 * honestly represent the car" problem a photo or icon both have, while
 * actually giving the customer more real information than either did.
 *
 * Applied here with AMS Airport Ride's own colors (ink navy + amber),
 * never SchipholRide's orange/cream — same "inspiration, not a copy"
 * rule this project has followed for every competitor-research pass.
 * The example-model line is only as specific as what's actually true:
 * client-confirmed the XL Van is genuinely (almost always) a Mercedes
 * V-Class, so that's named directly. Comfort's real vehicle varies too
 * much to name a brand (confirmed with the client) — "Comfortabele
 * sedan of vergelijkbaar" describes the body type instead, same honesty
 * bar, just less specific because the underlying fact is less specific.
 */
export async function VehiclesSimple() {
  const t = await getTranslations("Vehicles");

  const vehicles = [
    {
      title: t("sedanTitle"),
      model: t("sedanModel"),
      specs: t("specsLine", {
        passengers: `1–${PERSONENAUTO_MAX_PASSENGERS}`,
        luggage: PERSONENAUTO_MAX_LUGGAGE,
      }),
      price: CHEAPEST_SCHIPHOL_PRICE,
      cta: t("sedanCta"),
      mostChosen: true,
    },
    {
      title: t("busTitle"),
      model: t("busModel"),
      specs: t("specsLine", {
        passengers: `5–${BUS_MAX_PASSENGERS}`,
        luggage: BUS_MAX_LUGGAGE,
      }),
      price: CHEAPEST_SCHIPHOL_PRICE + BUS_SURCHARGE_EUR,
      cta: t("busCta"),
      mostChosen: false,
    },
  ];

  return (
    <section id="onze-autos" className="scroll-mt-24 mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h2>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {vehicles.map(({ title, model, specs, price, cta, mostChosen }) => (
          <Link
            key={title}
            href="/#boeken"
            className="group relative flex flex-col overflow-hidden rounded-[18px] bg-ink p-6 text-ink-foreground shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-elevated"
          >
            {mostChosen && (
              <span className="absolute right-6 top-6 rounded-[10px] bg-brand px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-foreground">
                {t("mostChosen")}
              </span>
            )}
            <span className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</span>
            <span className="mt-1 text-sm text-ink-foreground-muted">{model}</span>

            <span className="mt-5 border-t border-white/10 pt-5 font-mono text-sm text-ink-foreground-muted">
              {specs}
            </span>

            <span className="mt-5 flex items-end justify-between gap-4">
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-wide text-ink-foreground-muted">
                  {t("fromLabel")}
                </span>
                <span className="block font-mono text-3xl font-bold text-brand">€{price}</span>
              </span>
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition duration-200 group-hover:bg-brand group-hover:text-brand-foreground">
                {cta}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
