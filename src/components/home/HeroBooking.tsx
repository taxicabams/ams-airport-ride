import { getTranslations } from "next-intl/server";
import { BookingWidget } from "@/components/booking/BookingWidget";

/**
 * v9 rebuild — the single biggest structural change: there is no
 * separate marketing hero with a big photo/illustration pushing the
 * booking widget below the fold. The booking widget IS the hero. A
 * short label + headline + one honest subline sit directly above it,
 * centered, then the wide booking interface, then one compact trust
 * line — the whole first viewport is the product, per the client's
 * explicit spec ("GEEN gigantische marketinghero... De booking is het
 * centrale product").
 */
export async function HeroBooking() {
  const t = await getTranslations("Hero");

  return (
    <section className="bg-background pb-10 pt-10 sm:pb-14 sm:pt-14">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-lg font-medium text-foreground/80">{t("subtitle")}</p>
      </div>

      <div className="mx-auto mt-8 max-w-xl px-4 sm:px-6">
        <BookingWidget />
        <p className="mt-4 text-center text-sm text-muted">{t("compactTrustLine")}</p>
      </div>
    </section>
  );
}
