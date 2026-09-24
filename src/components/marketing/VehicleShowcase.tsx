import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { CarIcon } from "@/components/ui/icons";
import { AmsterdamSkyline } from "./AmsterdamSkyline";
import { vehiclePhoto } from "@/lib/vehiclePhoto";
import { PERSONENAUTO_MAX_PASSENGERS, BUS_MAX_PASSENGERS } from "@/lib/pricing/vehicle";

/**
 * Combines the requested "real vehicle visual" with the vehicle-types
 * summary in one section. The visual slot renders `vehiclePhoto.url`
 * the moment the client supplies a real photo — until then, an
 * original graphic (car icon + the same Amsterdam skyline motif used
 * elsewhere, never a stock photo or an AI-generated image) fills the
 * space so it reads as a deliberate design choice, not a broken image.
 *
 * Capacity numbers are imported from the pricing engine's own vehicle
 * config, never hand-typed here — they can only ever match what the
 * booking flow actually allows.
 */
export async function VehicleShowcase() {
  const t = await getTranslations("Vehicles");
  const locale = (await getLocale()) as "nl" | "en";

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-brand/10 to-muted-background">
          {vehiclePhoto.url ? (
            <Image
              src={vehiclePhoto.url}
              alt={vehiclePhoto.alt[locale]}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <CarIcon className="h-16 w-16 text-brand" />
              <AmsterdamSkyline className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-brand/10" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border p-4">
              <CarIcon className="h-8 w-8 text-brand" />
              <p className="mt-3 font-semibold text-foreground">{t("sedanTitle")}</p>
              {/* {max} is interpolated from the pricing engine's own
                  constant, not hand-typed — this text can never claim a
                  capacity the booking flow doesn't actually allow. */}
              <p className="mt-1 text-sm text-muted">
                {t("sedanCapacity", { max: PERSONENAUTO_MAX_PASSENGERS })}
              </p>
            </div>
            <div className="rounded-xl border border-border p-4">
              <CarIcon className="h-8 w-8 text-brand" />
              <p className="mt-3 font-semibold text-foreground">{t("busTitle")}</p>
              <p className="mt-1 text-sm text-muted">
                {t("busCapacity", { max: BUS_MAX_PASSENGERS })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
