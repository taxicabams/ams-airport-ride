import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CarIcon, VanIcon, ArrowRightIcon } from "@/components/ui/icons";
import {
  PERSONENAUTO_MAX_PASSENGERS,
  BUS_MAX_PASSENGERS,
  BUS_SURCHARGE_EUR,
} from "@/lib/pricing/vehicle";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";
import { vehiclePhoto } from "@/lib/vehiclePhoto";
import { heroPhoto } from "@/lib/heroPhoto";

/**
 * "Vertrekbord" rebuild — "Meest gekozen" badge on Comfort, and real
 * "vanaf €X" prices computed from the actual pricing engine
 * (CHEAPEST_SCHIPHOL_PRICE + BUS_SURCHARGE_EUR) — never invented.
 *
 * Real photos, per direct feedback ("zoek taxi auto fotos en gebruik
 * ze"): searched Pexels for a generic black sedan for Comfort, but every
 * clean-looking result had a visible, legible (non-Dutch) license plate
 * or actual company livery — the same honesty bar this project has held
 * to all along (no plates/logos that could misrepresent the vehicle).
 * Comfort stays the icon placeholder for now rather than use a photo
 * that fails that bar. Taxibus reuses heroPhoto.ts's already-vetted,
 * plate-free, generic MPV/van-at-an-airport photo — a legitimate reuse,
 * not a new/unvetted image. vehiclePhoto.ts (the client's own real
 * fleet photo, still null) still overrides both the moment it's set.
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
      photo: null as { url: string; alt: { nl: string; en: string } } | null,
    },
    {
      Icon: VanIcon,
      title: t("busTitle"),
      capacity: tb("vehicleBusCapacity", { max: BUS_MAX_PASSENGERS }),
      price: CHEAPEST_SCHIPHOL_PRICE + BUS_SURCHARGE_EUR,
      mostChosen: false,
      photo: heroPhoto,
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
        {vehicles.map(({ Icon, title, capacity, price, mostChosen, photo }) => {
          const displayPhoto = vehiclePhoto.url ? { url: vehiclePhoto.url, alt: vehiclePhoto.alt } : photo;
          return (
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
            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-[#17263d] to-ink-2 sm:h-48">
              {displayPhoto ? (
                <Image src={displayPhoto.url} alt={displayPhoto.alt.nl} fill className="object-cover" />
              ) : (
                <Icon className="h-16 w-16 text-brand sm:h-20 sm:w-20" />
              )}
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
          );
        })}
      </div>
    </section>
  );
}
