"use client";

import { useTranslations } from "next-intl";
import type { Quote } from "@/lib/pricing";

export function QuoteStep({
  quote,
  loading,
  onBack,
  onBook,
}: {
  quote: Quote | null;
  loading: boolean;
  onBack: () => void;
  onBook: () => void;
}) {
  const t = useTranslations("Booking");

  if (loading || !quote) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm text-muted">{t("calculating")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* One confident total, never a "vanaf"/range, and never broken
          down into base price + vehicle surcharge — the customer sees
          only the final number, at every step of the flow (see the
          matching choice in DetailsStep's vehicle picker). */}
      <div className="rounded-xl border border-brand/20 bg-brand/5 p-5 text-center">
        <p className="text-sm font-medium text-muted">{t("priceLabel")}</p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-brand">
          €{quote.totalPrice}
        </p>
        <p className="mt-2 text-xs font-medium text-muted">{t("noHiddenCosts")}</p>
      </div>

      <p className="text-center text-sm text-muted">{t("paymentNote")}</p>

      <div className="mt-1 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-border px-5 py-3 text-base font-semibold text-foreground transition hover:bg-muted-background"
        >
          {t("backButton")}
        </button>
        <button
          type="button"
          onClick={onBook}
          className="flex-1 rounded-full bg-accent px-5 py-3 text-base font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
        >
          {t("bookButton")}
        </button>
      </div>
    </div>
  );
}
