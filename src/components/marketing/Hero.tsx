import { getTranslations } from "next-intl/server";
import { BookingWidget } from "@/components/booking/BookingWidget";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="bg-gradient-to-b from-brand/5 to-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
        {/* Mobile: the calculator comes first — "no long explanation
            before the calculator begins" — the customer should see
            "book your taxi" and start typing immediately, with the
            supporting copy right below it. Desktop keeps the original
            side-by-side layout (order reset at the lg breakpoint). */}
        <div className="order-2 lg:order-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">{t("subtitle")}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-2 text-sm font-medium text-brand">
            {t("trustLine")}
          </p>
        </div>

        <div className="order-1 lg:order-2">
          <BookingWidget />
        </div>
      </div>
    </section>
  );
}
