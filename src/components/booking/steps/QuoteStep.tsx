"use client";

import { useTranslations } from "next-intl";
import type { Quote } from "@/lib/pricing";

export function QuoteStep({
  quote,
  returnQuote,
  pickup,
  destination,
  loading,
  error,
  onRetry,
  onBack,
  onBook,
}: {
  quote: Quote | null;
  returnQuote: Quote | null;
  pickup: string;
  destination: string;
  loading: boolean;
  error?: string | null;
  onRetry: () => void;
  onBack: () => void;
  onBook: () => void;
}) {
  const t = useTranslations("Booking");

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm text-muted">{t("calculating")}</p>
      </div>
    );
  }

  // A failed /api/quote call (or a network error) must never leave the
  // customer staring at a permanent spinner — offer a clear message plus
  // a way forward (retry the same request, or go back and adjust).
  if (error || !quote) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p role="alert" className="text-sm font-medium text-red-600">{t("quoteError")}</p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-border px-5 py-3 text-base font-semibold text-foreground transition hover:bg-muted-background"
          >
            {t("backButton")}
          </button>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-full bg-brand px-5 py-3 text-base font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark"
          >
            {t("retryButton")}
          </button>
        </div>
      </div>
    );
  }

  const grandTotal = quote.totalPrice + (returnQuote?.totalPrice ?? 0);

  return (
    <div className="flex flex-col gap-4">
      {/* One confident total, never a "vanaf"/range, and never broken
          down into base price + vehicle surcharge — the customer sees
          only the final number(s), at every step of the flow (see the
          matching choice in DetailsStep's vehicle picker). */}
      {returnQuote ? (
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-5">
          <TripPriceRow label={t("outboundTripLabel")} route={`${pickup} → ${destination}`} price={quote.totalPrice} />
          <div className="my-3 border-t border-brand/10" />
          <TripPriceRow
            label={t("returnTripSummaryLabel")}
            route={`${destination} → ${pickup}`}
            price={returnQuote.totalPrice}
          />
          <div className="my-3 border-t border-brand/20" />
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{t("totalLabel")}</p>
            <p className="text-3xl font-bold tracking-tight text-brand">€{grandTotal}</p>
          </div>
          <p className="mt-2 text-center text-xs font-medium text-muted">{t("noHiddenCosts")}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-5 text-center">
          <p className="text-sm font-medium text-muted">{t("priceLabel")}</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-brand">€{quote.totalPrice}</p>
          <p className="mt-2 text-xs font-medium text-muted">{t("noHiddenCosts")}</p>
        </div>
      )}

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

function TripPriceRow({ label, route, price }: { label: string; route: string; price: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="truncate text-sm text-foreground/90">{route}</p>
      </div>
      <p className="shrink-0 text-lg font-bold text-brand">€{price}</p>
    </div>
  );
}
