import { getTranslations } from "next-intl/server";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { PriceTagIcon, PaymentIcon, ReceiptIcon, DoorIcon } from "@/components/ui/icons";
import { AmsterdamSkyline } from "./AmsterdamSkyline";

export async function Hero() {
  const t = await getTranslations("Hero");

  // Icons are purely decorative next to short, self-explanatory labels —
  // aria-hidden keeps screen readers from announcing a redundant "image".
  const trustPoints = [
    { icon: <PriceTagIcon className="h-4 w-4 shrink-0" />, label: t("trustPoint1") },
    { icon: <PaymentIcon className="h-4 w-4 shrink-0" />, label: t("trustPoint2") },
    { icon: <ReceiptIcon className="h-4 w-4 shrink-0" />, label: t("trustPoint3") },
    { icon: <DoorIcon className="h-4 w-4 shrink-0" />, label: t("trustPoint4") },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand/5 to-background">
      {/* Subtle brand motif, not content — aria-hidden and behind
          everything (z-0 vs. the grid's default stacking), never dark
          enough to affect text contrast. */}
      <AmsterdamSkyline className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-16 w-full text-brand/5 sm:h-24" />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
        {/* Text stack comes first in DOM order on every screen size — on
            mobile this puts the eyebrow/title/price/subtitle above the
            calculator, so "vaste prijs vanaf €35" is visible without
            scrolling past the widget first. Desktop's lg:grid-cols keeps
            the original side-by-side layout regardless of DOM order. */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-xl font-bold text-brand sm:text-2xl">{t("priceMessage")}</p>
          <p className="mt-4 max-w-xl text-lg text-muted">{t("subtitle")}</p>
        </div>

        <div>
          {/* Compact price/trust card — repeats "vanaf €35" right next to
              the calculator itself (not just once, higher up in the
              text column), with the two most-booked routes as concrete
              examples. Never a flat €35 for every Amsterdam address —
              the calculator below still determines the real price. */}
          <div className="mb-4 rounded-xl border border-brand/20 bg-brand/5 p-4">
            <p className="text-base font-bold text-brand">{t("priceCardTitle")}</p>
            <p className="mt-1 text-sm text-foreground/80">{t("priceCardRouteA")}</p>
            <p className="text-sm text-foreground/80">{t("priceCardRouteB")}</p>
          </div>

          <BookingWidget />

          <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-foreground/80">
            {trustPoints.map((point) => (
              <li key={point.label} className="flex items-center gap-1.5">
                <span aria-hidden="true" className="text-brand">
                  {point.icon}
                </span>
                {point.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
