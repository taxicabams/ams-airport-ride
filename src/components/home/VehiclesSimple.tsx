import { getTranslations, getLocale } from "next-intl/server";
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
import { comfortPhoto } from "@/lib/comfortPhoto";

/**
 * "Vertrekbord" rebuild — badge on Comfort, and real "vanaf €X" prices
 * computed from the actual pricing engine (CHEAPEST_SCHIPHOL_PRICE +
 * BUS_SURCHARGE_EUR) — never invented.
 *
 * Real issue found during a pricing/marketing review: the badge used to
 * read "Meest gekozen" (most chosen) — a factual claim about OTHER
 * customers' behavior — while `mostChosen: true` below is simply
 * hardcoded, never derived from real booking volume. That's exactly the
 * class of unverifiable operational claim this project has avoided
 * everywhere else (reviews, "24/7 bereikbaar", KvK, etc.) — it just
 * read as an ordinary design pattern so it slipped through earlier.
 * Changed the label to "Aanbevolen" (Recommended) — an honest editorial
 * opinion (Comfort fits the common 1-4 passenger case), not a claim
 * about what other people did. Same visual/conversion value, nothing
 * fabricated.
 *
 * Real photos, per direct feedback ("zoek taxi auto fotos en gebruik
 * ze"): a first pass found every clean-looking Comfort candidate had a
 * visible, legible license plate or actual company livery — the same
 * honesty bar this project has held to all along (no plates/logos that
 * could misrepresent the vehicle) — so Comfort shipped as an icon
 * placeholder. A later, wider search (comfortPhoto.ts) found a clean
 * generic black sedan with no plate in frame either way. XL Van reuses
 * heroPhoto.ts's already-vetted, plate-free, generic MPV/van-at-an-
 * airport photo — a legitimate reuse, not a new/unvetted image.
 * vehiclePhoto.ts (the client's own real fleet photo, still null) still
 * overrides both the moment it's set.
 */
export async function VehiclesSimple() {
  const t = await getTranslations("Vehicles");
  const tb = await getTranslations("Booking");
  // Real, pre-existing bug found while touching this file for the new
  // Comfort photo: the vehicle photo's alt text was hardcoded to
  // `.alt.nl` regardless of the page's actual locale, so an English
  // visitor got Dutch alt text on both vehicle images.
  const locale = (await getLocale()) as "nl" | "en";

  const vehicles = [
    {
      Icon: CarIcon,
      title: t("sedanTitle"),
      capacity: tb("vehiclePersonenautoCapacity", { max: PERSONENAUTO_MAX_PASSENGERS }),
      price: CHEAPEST_SCHIPHOL_PRICE,
      mostChosen: true,
      photo: comfortPhoto as { url: string; alt: { nl: string; en: string } } | null,
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
                // Real performance bug found live: `fill` with no `sizes`
                // made Next.js assume this image could be full-viewport
                // width at every breakpoint, so it requested the largest
                // configured size (w=3840 — checked via the network
                // panel) for a card that's never wider than ~420px (this
                // section is max-w-4xl / 896px, 2 columns, gap-6 — see
                // the grid above). That's a multi-megabyte image for a
                // card a few hundred pixels wide, on every single
                // homepage visit. sizes below matches the real rendered
                // width at each breakpoint instead of guessing 100vw.
                <Image
                  src={displayPhoto.url}
                  alt={displayPhoto.alt[locale]}
                  fill
                  sizes="(min-width: 640px) 420px, 100vw"
                  className="object-cover"
                />
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
