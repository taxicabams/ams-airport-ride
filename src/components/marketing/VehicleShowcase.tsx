import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CarIcon } from "@/components/ui/icons";
import { AmsterdamSkyline } from "./AmsterdamSkyline";
import { PERSONENAUTO_MAX_PASSENGERS, BUS_MAX_PASSENGERS } from "@/lib/pricing/vehicle";

/**
 * Two large, equal cards per the brief (Sedan / Taxi Van) instead of one
 * shared photo + a small capacity grid. No real vehicle photo exists yet
 * (see the project's standing null-until-real convention) so each card's
 * visual stays the original car-icon + skyline graphic — never a stock
 * photo or an AI-generated image. Capacity numbers are imported from the
 * pricing engine's own vehicle config, never hand-typed, so this text can
 * never claim a capacity the booking flow doesn't actually allow.
 */
export async function VehicleShowcase() {
  const t = await getTranslations("Vehicles");

  const vehicles = [
    {
      title: t("sedanTitle"),
      capacity: t("sedanCapacity", { max: PERSONENAUTO_MAX_PASSENGERS }),
      body: t("sedanBody"),
      cta: t("sedanCta"),
    },
    {
      title: t("busTitle"),
      capacity: t("busCapacity", { max: BUS_MAX_PASSENGERS }),
      body: t("busBody"),
      cta: t("busCta"),
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.title}
            className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
          >
            <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden bg-gradient-to-b from-brand-light to-surface">
              <CarIcon className="h-16 w-16 text-brand" />
              <AmsterdamSkyline className="pointer-events-none absolute inset-x-0 bottom-0 h-10 w-full text-brand/10" />
            </div>
            <div className="p-6">
              <p className="text-lg font-bold text-foreground">{vehicle.title}</p>
              <p className="text-sm font-semibold text-brand">{vehicle.capacity}</p>
              <p className="mt-2 text-sm text-muted">{vehicle.body}</p>
              <Link
                href="/#boeken"
                className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
              >
                {vehicle.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
