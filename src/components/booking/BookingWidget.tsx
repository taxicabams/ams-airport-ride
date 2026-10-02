"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Quote, VehicleType } from "@/lib/pricing";
import { BUS_SURCHARGE_EUR } from "@/lib/pricing";
import { companyInfo } from "@/lib/companyInfo";
import { track } from "@/lib/analytics";
import { StepTracker } from "@/components/ui/StepTracker";
import { RouteStep } from "./steps/RouteStep";
import { DetailsStep } from "./steps/DetailsStep";
import { QuoteStep } from "./steps/QuoteStep";
import { ContactStep } from "./steps/ContactStep";
import { ConfirmationCard } from "./ConfirmationCard";
import { initialBookingForm, type BookingFormState, type BookingResult, type WizardStep } from "./types";
import { STEP_ORDER } from "./stepOrder";

// Real bug found via a customer-journey QA pass: this whole wizard was
// pure in-memory React state with no URL/sessionStorage backing at all.
// A customer who filled in everything (address, date, vehicle, even
// their full contact details) and then hit their phone's back gesture,
// refreshed, or the tab was reloaded lost EVERYTHING with zero warning
// and had to start over from a blank form. Draft-persisting the form
// (not the step — see the restore logic below) to sessionStorage fixes
// this: same-tab only (never leaks to other tabs/devices), cleared on
// tab close (unlike localStorage), and explicitly cleared the moment a
// booking actually completes (see submitBooking) so a second booking in
// the same tab never silently inherits the first one's name/phone/
// address — the exact opposite bug the same QA pass explicitly called
// out (item 7, "opnieuw boeken mag geen oude data bevatten").
const DRAFT_KEY = "ams-booking-draft-v1";

function readDraft(): BookingFormState | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Cheap shape check — a malformed/old-shape draft is worse than no
    // draft (it could feed garbage into the pricing/booking APIs), so
    // require the object to at least look like a BookingFormState.
    if (typeof parsed !== "object" || parsed === null || typeof parsed.pickup !== "string") return null;
    return parsed as BookingFormState;
  } catch {
    return null;
  }
}

function writeDraft(form: BookingFormState) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  } catch {
    // Private browsing / storage disabled / quota exceeded — the wizard
    // still works perfectly, it just can't survive a refresh. Never
    // let this throw into the render path.
  }
}

function clearDraft() {
  try {
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Same as above — nothing to do if storage isn't available.
  }
}

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
  const locale = useLocale();
  // Always resume at "route" (never deeper) — the restored form fields
  // (address, date/time, passengers, vehicle, even contact details)
  // still get the customer there in a couple of clicks with nothing to
  // retype, without this component needing to also replay the /api/quote
  // fetch a resumed "quote"/"contact" step would otherwise need.
  const [step, setStep] = useState<WizardStep>("route");
  // Real bug found live while testing this exact feature: an earlier
  // version read sessionStorage right inside this useState's lazy
  // initializer, branching on `typeof window`. That initializer runs
  // during BOTH the server render (window is undefined -> empty form)
  // AND the client's hydration render (window exists -> restored form)
  // — two different outputs for what React expects to be the same
  // render, a classic hydration mismatch. The address TEXT still showed
  // correctly (React patches mismatched text during hydration), but the
  // *derived* "Volgende" enabled/disabled state stayed stuck reflecting
  // the server's empty-form calculation — a customer would see their
  // restored address but Volgende silently refusing to click.
  // Fix: initialize identically on server and client (never read
  // storage here), then restore in a useEffect — which by definition
  // only ever runs client-side, after hydration has already matched, so
  // the restore becomes a normal, hydration-safe state update instead
  // of a mismatch. Costs one extra render right after mount; invisible
  // in practice.
  const [form, setForm] = useState<BookingFormState>({
    ...initialBookingForm,
    pickup: initialPickup,
    destination: initialDestination,
  });
  // Two things to skip writing back, both real bugs caught while
  // building this: (1) the very first mount's own untouched default
  // form — harmless to write, just pointless — and (2) the setForm
  // the restore effect below triggers, which fires this same [form]
  // effect a second time on mount with data already identical to what's
  // in storage. Skipping (2) matters more than it looks: without it, a
  // race is possible where this effect's own stale `form` closure (the
  // pre-restore default, still empty) writes AFTER the restore has
  // already happened, silently clobbering the very draft that was just
  // read — the customer's restored session would work for this page
  // view, but a second refresh right after would find nothing.
  const isFirstRender = useRef(true);
  const skipNextWrite = useRef(false);
  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      skipNextWrite.current = true;
      // Hydrating persisted state from an external store (sessionStorage)
      // on mount is the one well-known, accepted exception to "don't
      // setState in an effect" — there's no prop/render-time equivalent
      // for "read a synchronous browser API once after hydration."
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(draft);
    }
  }, []);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (skipNextWrite.current) {
      skipNextWrite.current = false;
      return;
    }
    writeDraft(form);
  }, [form]);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [returnQuote, setReturnQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  // The Personenauto quote for the outbound route, fetched once when the
  // customer leaves RouteStep — this is the SAME real Google-Routes-based
  // number shown twice: once as DetailsStep's vehicle-picker preview,
  // and again as QuoteStep's confirmed price (goToQuote reuses it below
  // instead of fetching a second time). Base price doesn't depend on
  // vehicle type, so one fetch covers both Personenauto and Bus. Sharing
  // one object like this is what guarantees the two screens can never
  // show different numbers for the same route — see the bug this fixed:
  // the preview used to run a local, coordinate-free estimate while the
  // final quote used the real route, and for a plain per-km private-ride
  // price the two could visibly disagree (e.g. €110 vs €119).
  const [carQuote, setCarQuote] = useState<Quote | null>(null);
  const [carQuoteLoading, setCarQuoteLoading] = useState(false);
  const [carQuoteError, setCarQuoteError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);

  function patch(update: Partial<BookingFormState>) {
    setForm((prev) => ({ ...prev, ...update }));
  }

  async function fetchQuote(params: {
    pickup: string;
    destination: string;
    pickupLat?: number;
    pickupLng?: number;
    destinationLat?: number;
    destinationLng?: number;
    vehicleType: VehicleType;
  }): Promise<Quote> {
    const res = await fetch("/api/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    // A non-2xx response (e.g. the API's 503 fallback, or a network-level
    // failure) must never be parsed as a quote — without this check,
    // `data.quote` would silently be `undefined` and the customer would
    // be stuck on QuoteStep's loading spinner forever (it only clears on
    // a truthy quote). Throwing here is what lets goToQuote's catch
    // below show a real error instead.
    if (!res.ok) throw new Error("quote_failed");
    const data = await res.json();
    return data.quote as Quote;
  }

  // Fired once, right when the customer leaves RouteStep with a resolved
  // pickup/destination — always priced as Personenauto (base price is
  // vehicle-independent; see vehicle.ts), so DetailsStep derives the Bus
  // price locally by adding BUS_SURCHARGE_EUR rather than fetching again.
  async function loadCarQuotePreview() {
    setCarQuoteLoading(true);
    setCarQuoteError(false);
    try {
      const preview = await fetchQuote({
        pickup: form.pickup,
        destination: form.destination,
        pickupLat: form.pickupLat,
        pickupLng: form.pickupLng,
        destinationLat: form.destinationLat,
        destinationLng: form.destinationLng,
        vehicleType: "PERSONENAUTO",
      });
      setCarQuote(preview);
    } catch {
      setCarQuote(null);
      setCarQuoteError(true);
    } finally {
      setCarQuoteLoading(false);
    }
  }

  async function goToQuote() {
    setStep("quote");
    setQuoteLoading(true);
    setQuoteError(null);
    try {
      // Reuse the exact same real, Google-Routes-based quote already
      // fetched for DetailsStep's vehicle-picker preview (loadCarQuotePreview)
      // instead of computing it a second time — this is what guarantees
      // the price the customer picked a vehicle against is IDENTICAL to
      // the one confirmed here, never a second, separately-rounded
      // calculation. Only a missing preview (a failed fetch, or this
      // function somehow running before it resolved) falls back to
      // fetching fresh here, same as before this sharing existed.
      const carBase =
        carQuote ??
        (await fetchQuote({
          pickup: form.pickup,
          destination: form.destination,
          pickupLat: form.pickupLat,
          pickupLng: form.pickupLng,
          destinationLat: form.destinationLat,
          destinationLng: form.destinationLng,
          vehicleType: "PERSONENAUTO",
        }));
      const outbound: Quote =
        form.vehicleType === "BUS"
          ? {
              ...carBase,
              vehicleSurcharge: BUS_SURCHARGE_EUR,
              totalPrice: carBase.basePrice + BUS_SURCHARGE_EUR,
            }
          : carBase;
      setQuote(outbound);
      track("quote_calculated", { rideType: outbound.rideType, totalPrice: outbound.totalPrice });

      // A return leg is quoted by calling the exact same endpoint again
      // with pickup/destination (and their coordinates) swapped — never
      // a separate calculation. See the plan's return-trip pricing note.
      if (form.returnTrip) {
        const back = await fetchQuote({
          pickup: form.destination,
          destination: form.pickup,
          pickupLat: form.destinationLat,
          pickupLng: form.destinationLng,
          destinationLat: form.pickupLat,
          destinationLng: form.pickupLng,
          vehicleType: form.vehicleType,
        });
        setReturnQuote(back);
      } else {
        setReturnQuote(null);
      }
    } catch {
      setQuote(null);
      setReturnQuote(null);
      setQuoteError("error");
    } finally {
      setQuoteLoading(false);
    }
  }

  async function submitBooking() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // The server picks the confirmation email's language from this
      // header (see /api/bookings) — without it, every booking fell
      // back to the site's default locale (Dutch) regardless of which
      // language the customer actually booked in. Found via a real
      // production booking made on /en that still arrived in Dutch.
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-locale": locale },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Booking failed");
      const data = await res.json();
      track("booking_completed", { bookingId: data.bookingId });
      // Clear the draft the instant a booking actually completes — a
      // second booking started later in the same tab must never inherit
      // this one's name/phone/address (see this function's own note).
      clearDraft();
      setResult({
        bookingId: data.bookingId,
        quote: data.quote as Quote,
        returnQuote: (data.returnQuote as Quote | null) ?? null,
        totalPrice: data.totalPrice as number,
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
    <div
      id="boeken"
      className="mx-auto w-full max-w-4xl scroll-mt-24 rounded-3xl border border-border bg-surface p-6 shadow-elevated sm:p-8 lg:p-10"
    >
      {step !== "confirmed" && (
        <>
          <StepTracker
            steps={[t("stepRouteLabel"), t("stepVehicleLabel"), t("stepPriceLabel"), t("stepDetailsLabel")]}
            currentIndex={stepIndex}
          />
          <div className="mb-1 flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground">{t("heading")}</h2>
          </div>
          {/* Reassurance shown once, on the first step — the brief's
              "no online payment" / "see your price before booking"
              micro-copy, kept to a single line so it never competes with
              the address fields for attention. */}
          {step === "route" && (
            <p className="mb-3 text-sm text-muted">{t("headingSubtitle")}</p>
          )}
        </>
      )}

      {step === "route" && (
        <RouteStep
          form={form}
          onChange={patch}
          onNext={() => {
            // Two distinct events, same moment: `route_searched` is the
            // funnel-stage name the conversion blueprint tracks end-to-end
            // (Ads click -> route -> quote -> vehicle -> booking);
            // `calculator_started` is kept for backward compatibility with
            // anything already keyed on that name.
            track("route_searched", { pickup: form.pickup, destination: form.destination });
            track("calculator_started");
            setStep("details");
            loadCarQuotePreview();
          }}
        />
      )}

      {step === "details" && (
        <DetailsStep
          form={form}
          onChange={patch}
          onBack={() => setStep("route")}
          onNext={goToQuote}
          carQuote={carQuote}
          carQuoteLoading={carQuoteLoading}
          carQuoteError={carQuoteError}
          onRetryCarQuote={loadCarQuotePreview}
        />
      )}

      {step === "quote" && (
        <QuoteStep
          quote={quote}
          returnQuote={returnQuote}
          pickup={form.pickup}
          destination={form.destination}
          vehicleType={form.vehicleType}
          passengers={form.passengers}
          loading={quoteLoading}
          error={quoteError}
          onRetry={goToQuote}
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
            <p role="alert" className="mt-3 text-center text-sm text-danger">{t("submitError")}</p>
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
              className="font-semibold text-brand-text hover:underline"
            >
              {t("callUs")}
            </a>
          )}
          {companyInfo.whatsapp && (
            <a
              href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(t("whatsappPrefill"))}`}
              onClick={() => track("whatsapp_clicked")}
              // Real accessibility bug found via a Lighthouse audit:
              // text-success (#3ddc84, tuned for dark backgrounds like
              // FlightMonitorBar's) is only 1.78:1 on this card's white
              // surface — badly fails the 4.5:1 WCAG AA minimum.
              // text-brand-text is the same already-contrast-checked
              // color the "Bel ons" link right next to it uses.
              className="font-semibold text-brand-text hover:underline"
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
