"use client";

import { useState } from "react";
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
  const [showBreakdown, setShowBreakdown] = useState(false);

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
      {/* One confident total, never a "vanaf"/range — the whole point of
          the fixed-price promise. Breakdown is available but tucked away
          so the headline number stays the visual anchor. */}
      <div className="rounded-xl border border-brand/20 bg-brand/5 p-5 text-center">
        <p className="text-sm font-medium text-muted">{t("priceLabel")}</p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-brand">
          €{quote.totalPrice}
        </p>

        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          className="mt-3 text-xs font-medium text-muted underline decoration-dotted underline-offset-2"
        >
          {t("priceBreakdownToggle")}
        </button>

        {showBreakdown && (
          <dl className="mt-3 space-y-1 border-t border-border/60 pt-3 text-left text-sm text-muted">
            <div className="flex justify-between">
              <dt>{t("priceBase")}</dt>
              <dd>€{quote.basePrice}</dd>
            </div>
            {quote.surcharges.map((s) => (
              <div key={s.label} className="flex justify-between">
                <dt>{s.label}</dt>
                <dd>€{s.amount}</dd>
              </div>
            ))}
            {quote.vehicleSurcharge > 0 && (
              <div className="flex justify-between">
                <dt>{t("priceVehicleSurcharge")}</dt>
                <dd>€{quote.vehicleSurcharge}</dd>
              </div>
            )}
          </dl>
        )}
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
