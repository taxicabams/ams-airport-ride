"use client";

import { useTranslations } from "next-intl";
import type { Quote, VehicleType } from "@/lib/pricing";
import { PERSONENAUTO_MAX_PASSENGERS, BUS_MAX_PASSENGERS } from "@/lib/pricing";

export function QuoteStep({
  quote,
  returnQuote,
  pickup,
  destination,
  vehicleType,
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
  vehicleType: VehicleType;
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
        <p role="alert" className="text-sm font-medium text-danger">{t("quoteError")}</p>
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

  // Never claim a calculated private ride is a flat Schiphol-style fare:
  // the basis line tells the truth per `quote.source` — "fixed" only for
  // a curated Schiphol route (staticRoutes.ts), "estimate" for the
  // distance+time formula every other ride uses (fallback.ts). A return
  // trip reuses the same pickup/destination pair in reverse, so it always
  // shares the outbound leg's source — one honest line still covers both.
  const priceBasis = quote.source === "fixed" ? t("priceBasisFixed") : t("priceBasisEstimate");
  const vehicleSummary =
    vehicleType === "BUS"
      ? t("vehicleSummaryBus", { max: BUS_MAX_PASSENGERS })
      : t("vehicleSummarySedan", { max: PERSONENAUTO_MAX_PASSENGERS });

  return (
    <div className="flex flex-col gap-4">
      {/* The price-reveal screen: this is deliberately the single largest,
          most dominant element in the whole booking flow — one confident
          number, never a "vanaf"/range, and never broken down into base
          price + vehicle surcharge (see the matching choice in
          DetailsStep's smaller per-card preview). */}
      <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 text-center sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">
          {t("priceHeading")}
        </p>
        <p className="mt-2 text-6xl font-bold tracking-tight text-brand-text sm:text-7xl">
          €{grandTotal}
        </p>
        <p className="mt-3 truncate text-base font-medium text-foreground/90">
          {pickup} → {destination}
        </p>
        <p className="mt-1 text-sm text-muted">{vehicleSummary}</p>
        <p className="mt-3 text-sm font-semibold text-brand-text">{priceBasis}</p>

        {returnQuote && (
          <div className="mt-5 border-t border-brand/10 pt-4 text-left">
            <TripPriceRow label={t("outboundTripLabel")} route={`${pickup} → ${destination}`} price={quote.totalPrice} />
            <div className="my-3 border-t border-brand/10" />
            <TripPriceRow
              label={t("returnTripSummaryLabel")}
              route={`${destination} → ${pickup}`}
              price={returnQuote.totalPrice}
            />
          </div>
        )}

        <p className="mt-4 text-xs font-medium text-muted">{t("noHiddenCosts")}</p>
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

function TripPriceRow({ label, route, price }: { label: string; route: string; price: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="truncate text-sm text-foreground/90">{route}</p>
      </div>
      <p className="shrink-0 text-lg font-bold text-brand-text">€{price}</p>
    </div>
  );
}
