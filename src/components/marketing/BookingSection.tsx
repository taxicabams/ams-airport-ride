import { getTranslations } from "next-intl/server";
import { BookingWidget } from "@/components/booking/BookingWidget";

/**
 * The booking card now lives in its own section instead of sitting beside
 * the hero text (see Hero.tsx) — the brief asks for it to visually
 * "overlap the lower part of the hero" on desktop and become a normal
 * full-width card on mobile. A negative top margin (desktop only) pulls
 * it up over Hero's bottom padding without any changes to Hero's own
 * layout or to BookingWidget itself.
 */
export async function BookingSection() {
  const t = await getTranslations("BookingSection");

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:-mt-16 lg:pb-0">
      <div className="mx-auto max-w-md text-center lg:hidden">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
        <h2 className="mt-1 text-2xl font-bold text-foreground">{t("title")}</h2>
      </div>
      <div className="mt-4 lg:mt-0">
        <BookingWidget />
      </div>
    </section>
  );
}
