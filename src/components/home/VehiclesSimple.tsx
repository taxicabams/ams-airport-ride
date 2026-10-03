import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CarIcon, VanIcon, ArrowRightIcon } from "@/components/ui/icons";
import {
  PERSONENAUTO_MAX_PASSENGERS,
  BUS_MAX_PASSENGERS,
  BUS_SURCHARGE_EUR,
} from "@/lib/pricing/vehicle";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";

/**
 * "Vertrekbord" rebuild — badge on Comfort, and real "vanaf €X" prices
 * computed from the actual pricing engine (CHEAPEST_SCHIPHOL_PRICE +
 * BUS_SURCHARGE_EUR) — never invented.
 *
 * Real issue found during a pricing/marketing review: the badge used to
 * read "Meest gekozen" (most chosen) — a factual claim about OTHER
 * customers' behavior — while `mostChosen: true` below is simply
 * hardcoded, never derived from real booking volume. Changed the label
 * to "Aanbevolen" (Recommended) — an honest editorial opinion, not a
 * claim about what other people did.
 *
 * Stock photos removed entirely, per direct feedback: two separate
 * sourced photos (comfortPhoto.ts, xlVanPhoto.ts — see git history)
 * still read as "nep" (fake/staged) even after an honesty pass on each
 * (no plates, no livery, genuinely matching vehicle class). A generic
 * stock photo claiming to show "your car" apparently reads as
 * inauthentic regardless of how carefully it's vetted — a real,
 * different problem than the honesty checks this project ran before,
 * and not one more careful photo-hunting was going to fix. Replaced
 * with a deliberately-designed icon treatment (glow + dot-grid texture
 * behind the existing hand-drawn Car/Van silhouettes) instead of
 * falling back to the old flat placeholder look. vehiclePhoto.ts (the
 * client's own real fleet photo, still null) is kept as a dormant
 * override for if/when a real fleet photo ever exists — see that
 * file's own note — but is never a stock substitute.
 */
export async function VehiclesSimple() {
  const t = await getTranslations("Vehicles");
  const tb = await getTranslations("Booking");

  const vehicles = [
    {
      Icon: CarIcon,
      title: t("sedanTitle"),
      capacity: tb("vehiclePersonenautoCapacity", { max: PERSONENAUTO_MAX_PASSENGERS }),
      price: CHEAPEST_SCHIPHOL_PRICE,
      mostChosen: true,
    },
    {
      Icon: VanIcon,
      title: t("busTitle"),
      capacity: tb("vehicleBusCapacity", { max: BUS_MAX_PASSENGERS }),
      price: CHEAPEST_SCHIPHOL_PRICE + BUS_SURCHARGE_EUR,
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
        {vehicles.map(({ Icon, title, capacity, price, mostChosen }) => (
          <Link
            key={title}
            href="/#boeken"
            className="group relative overflow-hidden rounded-[18px] border border-border bg-surface shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-elevated"
          >
            {mostChosen && (
              <span className="absolute left-4 top-4 z-10 rounded-[10px] bg-brand px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-foreground">
                {t("mostChosen")}
              </span>
            )}
            {/* Deliberately no photo — see this file's header note. A
                dot-grid texture + a soft brand-colored glow behind the
                existing hand-drawn Car/Van silhouette, both pure CSS, no
                image request at all (so the earlier "oversized photo"
                performance bug this card once had structurally can't
                recur here). */}
            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#17263d] to-ink-2 sm:h-48">
              <div
                className="absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
              />
              <div className="absolute h-28 w-28 rounded-full bg-brand/25 blur-2xl sm:h-32 sm:w-32" />
              <Icon className="relative h-16 w-16 text-brand sm:h-20 sm:w-20" />
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <span>
                <span className="block text-lg font-bold text-foreground">{title}</span>
                <span className="block text-sm text-muted">{capacity}</span>
                <span className="mt-1 block font-mono text-sm font-semibold text-brand-text">
                  {t("fromPrice", { price })}
                </span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted transition duration-200 group-hover:translate-x-1 group-hover:text-brand-text" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
