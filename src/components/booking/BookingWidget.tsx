"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Quote } from "@/lib/pricing";
import { companyInfo } from "@/lib/companyInfo";
import { track } from "@/lib/analytics";
import { RouteStep } from "./steps/RouteStep";
import { DetailsStep } from "./steps/DetailsStep";
import { QuoteStep } from "./steps/QuoteStep";
import { ContactStep } from "./steps/ContactStep";
import { ConfirmationCard } from "./ConfirmationCard";
import { initialBookingForm, type BookingFormState, type BookingResult, type WizardStep } from "./types";
import { STEP_ORDER } from "./stepOrder";

/**
 * The whole booking flow lives in this one client component tree
 * (route → details → quote → contact → confirmation), matching the
 * plan's "single wizard, price before contact info" design. Server
 * round-trips only happen for /api/quote and /api/bookings — everything
 * else is local state, so moving between steps is instant.
 */
export function BookingWidget({ initialPickup = "", initialDestination = "" }: {
  initialPickup?: string;
  initialDestination?: string;
}) {
  const t = useTranslations("Booking");
  const [step, setStep] = useState<WizardStep>("route");
  const [form, setForm] = useState<BookingFormState>({
    ...initialBookingForm,
    pickup: initialPickup,
    destination: initialDestination,
  });
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  function patch(update: Partial<BookingFormState>) {
    setForm((prev) => ({ ...prev, ...update }));
  }

  async function goToQuote() {
    setStep("quote");
    setQuoteLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: form.pickup,
          destination: form.destination,
          vehicleType: form.vehicleType,
        }),
      });
      const data = await res.json();
      setQuote(data.quote as Quote);
      // Fired once the price is actually known, not when the request
      // starts — "calculated" means completed.
      track("quote_calculated", {
        rideType: data.quote?.rideType,
        totalPrice: data.quote?.totalPrice,
      });
    } finally {
      setQuoteLoading(false);
    }
  }

  async function submitBooking() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Booking failed");
      const data = await res.json();
      track("booking_completed", { bookingId: data.bookingId });
      setResult({
        bookingId: data.bookingId,
        quote: data.quote as Quote,
        form,
        emailConfirmed: Boolean(data.emailConfigured),
      });
      setStep("confirmed");
    } catch {
      setSubmitError("error");
    } finally {
      setSubmitting(false);
    }
  }

  const stepIndex = STEP_ORDER.indexOf(step);

  return (
    <div id="boeken" className="mx-auto w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-lg sm:p-6">
      {step !== "confirmed" && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t("heading")}</h2>
            <span className="text-xs text-muted">
              {t("step", { current: stepIndex + 1, total: STEP_ORDER.length })}
            </span>
          </div>
          <div className="mb-5 h-1 w-full overflow-hidden rounded-full bg-muted-background">
            <div
              className="h-full rounded-full bg-brand transition-all"
              style={{ width: `${((stepIndex + 1) / STEP_ORDER.length) * 100}%` }}
            />
          </div>
        </>
      )}

      {step === "route" && (
        <RouteStep
          form={form}
          onChange={patch}
          onNext={() => {
            track("calculator_started");
            setStep("details");
          }}
        />
      )}

      {step === "details" && (
        <DetailsStep
          form={form}
          onChange={patch}
          onBack={() => setStep("route")}
          onNext={goToQuote}
        />
      )}

      {step === "quote" && (
        <QuoteStep
          quote={quote}
          loading={quoteLoading}
          onBack={() => setStep("details")}
          onBook={() => {
            track("booking_started");
            setStep("contact");
          }}
        />
      )}

      {step === "contact" && (
        <>
          <ContactStep
            form={form}
            onChange={patch}
            onBack={() => setStep("quote")}
            onSubmit={submitBooking}
            submitting={submitting}
          />
          {submitError && (
            <p className="mt-3 text-center text-sm text-red-600">{t("submitError")}</p>
          )}
        </>
      )}

      {step === "confirmed" && result && <ConfirmationCard result={result} />}

      {step !== "confirmed" && (companyInfo.phone || companyInfo.whatsapp) && (
        <div className="mt-5 flex items-center justify-center gap-4 border-t border-border pt-4 text-sm">
          <span className="text-muted">{t("orContact")}</span>
          {companyInfo.phone && (
            <a
              href={`tel:${companyInfo.phone}`}
              onClick={() => track("phone_clicked")}
              className="font-semibold text-brand hover:underline"
            >
              {t("callUs")}
            </a>
          )}
          {companyInfo.whatsapp && (
            <a
              href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(t("whatsappPrefill"))}`}
              onClick={() => track("whatsapp_clicked")}
              className="font-semibold text-success hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("whatsappUs")}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
