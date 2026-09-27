import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CarIcon, VanIcon, ArrowRightIcon } from "@/components/ui/icons";
import { PERSONENAUTO_MAX_PASSENGERS, BUS_MAX_PASSENGERS } from "@/lib/pricing/vehicle";
import { vehiclePhoto } from "@/lib/vehiclePhoto";

/**
 * Layout 4.0 — bigger, more premium cards: a tall image panel per
 * vehicle instead of a small inline icon. vehiclePhoto.ts is still null
 * (no real fleet photo confirmed) — per its own documented convention
 * (and the client's own earlier, explicit decision this session not to
 * source generic stock sedan/van photography), the panel stays a
 * designed navy/gold placeholder rather than a stock or AI-generated
 * image. The moment vehiclePhoto.url is set, this component needs zero
 * changes: the <Image> branch below picks it up automatically.
 *
 * Names stay "Comfort"/"Van" (not "Comfort Electric"/"Van Electric") —
 * see the standing note in messages/*.json's Vehicles namespace; the
 * fleet's electric status has never been confirmed.
 */
export async function VehiclesSimple() {
  const t = await getTranslations("Vehicles");
  const tb = await getTranslations("Booking");

  const vehicles = [
    {
      Icon: CarIcon,
      title: t("sedanTitle"),
      capacity: tb("vehiclePersonenautoCapacity", { max: PERSONENAUTO_MAX_PASSENGERS }),
    },
    {
      Icon: VanIcon,
      title: t("busTitle"),
      capacity: tb("vehicleBusCapacity", { max: BUS_MAX_PASSENGERS }),
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-text">{t("eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{t("title")}</h2>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {vehicles.map(({ Icon, title, capacity }) => (
          <Link
            key={title}
            href="/#boeken"
            className="group overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition duration-200 hover:-translate-y-1 hover:shadow-elevated"
          >
            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#17335a] to-[#0b1930] sm:h-48">
              {vehiclePhoto.url ? (
                <Image src={vehiclePhoto.url} alt={vehiclePhoto.alt.nl} fill className="object-cover" />
              ) : (
                <Icon className="h-16 w-16 text-brand sm:h-20 sm:w-20" />
              )}
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <span>
                <span className="block text-lg font-bold text-foreground">{title}</span>
                <span className="block text-sm text-muted">{capacity}</span>
              </span>
              <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted transition duration-200 group-hover:translate-x-1 group-hover:text-brand-text" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
