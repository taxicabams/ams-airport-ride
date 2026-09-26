"use client";

import { useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Field, inputClassName } from "@/components/ui/Field";
import { PickerField } from "@/components/ui/PickerField";
import { Stepper } from "@/components/ui/Stepper";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { CalendarIcon, ClockIcon } from "@/components/ui/icons";
import { detectRideType } from "@/lib/rideType";
import {
  BUS_SURCHARGE_EUR,
  BUS_MAX_PASSENGERS,
  BUS_MAX_LUGGAGE,
  recommendedVehicle,
  type Quote,
} from "@/lib/pricing";
import { track } from "@/lib/analytics";
import { formatDateLong } from "@/lib/formatDate";
import { isReturnDateTimeValid } from "@/lib/validation";
import type { BookingFormState } from "../types";

export function DetailsStep({
  form,
  onChange,
  onBack,
  onNext,
  carQuote,
  carQuoteLoading,
  carQuoteError,
  onRetryCarQuote,
}: {
  form: BookingFormState;
  onChange: (patch: Partial<BookingFormState>) => void;
  onBack: () => void;
  onNext: () => void;
  /**
   * The real, Google-Routes-based Personenauto quote for this route,
   * fetched once by BookingWidget right when this step is reached (see
   * loadCarQuotePreview) — never computed locally here anymore. Sharing
   * this exact object with the final QuoteStep is what guarantees the
   * price shown while picking a vehicle can never disagree with the
   * price actually confirmed a step later.
   */
  carQuote: Quote | null;
  carQuoteLoading: boolean;
  carQuoteError: boolean;
  onRetryCarQuote: () => void;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const rideType = detectRideType(form.pickup, form.destination);
  const isAirport = rideType === "AIRPORT_TRANSFER";

  // Fired once per mount when Schiphol is part of the route — pickup/
  // destination are fixed by the time the customer reaches this step,
  // so this doesn't re-fire on unrelated re-renders.
  useEffect(() => {
    if (isAirport) track("airport_transfer_selected");
  }, [isAirport]);

  const recommended = recommendedVehicle(form.passengers, form.luggage);
  // Auto-switch the vehicle when capacity requires it, unless the
  // customer already picked one themselves — see lib/pricing/vehicle.ts.
  const vehicleType = form.vehicleManuallyChosen ? form.vehicleType : recommended;
  const showAutoSwitchNote = !form.vehicleManuallyChosen && recommended === "BUS";

  // `vehicleType` above is only a *display* value re-derived every
  // render — without this, an auto-selected Bus would show as selected
  // in the UI but form.vehicleType (what actually gets quoted/booked)
  // would silently stay stuck at its PERSONENAUTO default. Keep the two
  // in sync whenever the customer hasn't manually chosen a vehicle.
  useEffect(() => {
    if (!form.vehicleManuallyChosen && form.vehicleType !== recommended) {
      onChange({ vehicleType: recommended });
    }
  }, [form.vehicleManuallyChosen, form.vehicleType, recommended, onChange]);

  // carQuote (fetched once by BookingWidget when this step is reached —
  // see loadCarQuotePreview) is the real, Google-Routes-based price, not
  // a local coordinate-free estimate. Base price doesn't depend on
  // vehicle type, so the Bus price is just the same base plus the fixed
  // surcharge — no separate fetch. The customer only ever sees the two
  // final amounts (e.g. "€50" / "€65") — never the underlying "+€15"
  // math or any technical seat-count text.
  const carPrice = carQuote?.basePrice ?? null;
  const busPrice = carPrice != null ? carPrice + BUS_SURCHARGE_EUR : null;
  const priceReady = carPrice != null && !carQuoteLoading;

  // See lib/formatDate.ts for the crash-safety note (invalid mid-edit
  // date values must never throw here).
  const dateDisplay = formatDateLong(form.date, locale);
  const returnDateDisplay = formatDateLong(form.returnDate, locale);

  // Same rule the server enforces (lib/validation.ts's zod .refine()) —
  // imported, not re-implemented, so the client and server can never
  // disagree about what counts as a valid return date/time.
  const returnDateTimeValid =
    !form.returnTrip || isReturnDateTimeValid(form.date, form.time, form.returnDate, form.returnTime);
  const showReturnError =
    form.returnTrip && form.returnDate.length > 0 && form.returnTime.length > 0 && !returnDateTimeValid;

  // Require an actually-valid date (not just a non-empty string) so an
  // in-progress/garbled native input value can never be used to
  // continue to the price step. A return trip additionally needs its
  // own valid date/time, strictly after the outbound leg. Also require
  // a successfully loaded price — proceeding on a failed/pending fetch
  // would leave QuoteStep to fall back to a second, separate calculation
  // (see goToQuote), reopening the exact mismatch this screen exists to
  // prevent.
  const canContinue =
    dateDisplay.length > 0 &&
    form.time.length > 0 &&
    (!form.returnTrip || (returnDateDisplay.length > 0 && form.returnTime.length > 0 && returnDateTimeValid)) &&
    priceReady;

  function selectVehicle(vehicle: "PERSONENAUTO" | "BUS") {
    track("vehicle_selected", { vehicleType: vehicle });
    onChange({ vehicleType: vehicle, vehicleManuallyChosen: true });
  }

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="rounded-lg border border-border p-3.5">
        <legend className="px-1 text-sm font-medium text-foreground">
          {t("whenHeading")}
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <PickerField
            id="date"
            type="date"
            label={t("dateLabel")}
            value={form.date}
            onChange={(value) => onChange({ date: value })}
            placeholder={t("chooseDate")}
            displayValue={dateDisplay}
            min={new Date().toISOString().slice(0, 10)}
            icon={<CalendarIcon />}
          />
          <PickerField
            id="time"
            type="time"
            label={t("timeLabel")}
            value={form.time}
            onChange={(value) => onChange({ time: value })}
            placeholder={t("chooseTime")}
            displayValue={form.time}
            step={900} // 15-minute increments
            icon={<ClockIcon />}
          />
        </div>

        <div className="mt-4">
          <SegmentedControl
            value={form.returnTrip ? "return" : "oneWay"}
            onChange={(value) => {
              const nextReturnTrip = value === "return";
              track("return_selected", { returnTrip: nextReturnTrip });
              onChange({ returnTrip: nextReturnTrip });
            }}
            options={[
              { value: "oneWay", label: t("oneWayLabel") },
              { value: "return", label: t("returnLabel") },
            ]}
          />
        </div>

        {form.returnTrip && (
          <div className="mt-3 border-t border-border pt-3">
            {/* The return route is always the outbound leg reversed —
                no separate address fields to fill in, per the client's
                "keep it simple" requirement. */}
            <p className="mb-2 text-xs text-muted">
              {form.destination || "…"} → {form.pickup || "…"}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <PickerField
                id="returnDate"
                type="date"
                label={t("returnDateLabel")}
                value={form.returnDate}
                onChange={(value) => onChange({ returnDate: value })}
                placeholder={t("chooseDate")}
                displayValue={returnDateDisplay}
                min={form.date || new Date().toISOString().slice(0, 10)}
                icon={<CalendarIcon />}
              />
              <PickerField
                id="returnTime"
                type="time"
                label={t("returnTimeLabel")}
                value={form.returnTime}
                onChange={(value) => onChange({ returnTime: value })}
                placeholder={t("chooseTime")}
                displayValue={form.returnTime}
                step={900}
                icon={<ClockIcon />}
              />
            </div>
            {showReturnError && (
              <p role="alert" className="mt-2 text-xs font-medium text-red-600">
                {t("returnDateTimeInvalid")}
              </p>
            )}
          </div>
        )}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Stepper
          id="passengers"
          label={t("passengersLabel")}
          value={form.passengers}
          min={1}
          max={BUS_MAX_PASSENGERS}
          onChange={(value) => onChange({ passengers: value })}
          decreaseLabel={t("decreasePassengers")}
          increaseLabel={t("increasePassengers")}
        />
        <Stepper
          id="luggage"
          label={t("luggageLabel")}
          value={form.luggage}
          min={0}
          max={BUS_MAX_LUGGAGE}
          onChange={(value) => onChange({ luggage: value })}
          decreaseLabel={t("decreaseLuggage")}
          increaseLabel={t("increaseLuggage")}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-foreground">
          {t("vehicleLabel")}
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <VehicleOption
            id="vehicle-personenauto"
            selected={vehicleType === "PERSONENAUTO"}
            disabled={recommended === "BUS" || !priceReady}
            title={t("vehiclePersonenauto")}
            // Only reveal a price once the customer has actively chosen
            // this vehicle themselves — never both at once, and never
            // before a deliberate click (form.vehicleManuallyChosen is
            // false on first render even though `vehicleType` already
            // defaults to the auto-recommended one).
            revealPrice={form.vehicleManuallyChosen && vehicleType === "PERSONENAUTO"}
            price={carPrice}
            onSelect={() => selectVehicle("PERSONENAUTO")}
          />
          <VehicleOption
            id="vehicle-bus"
            selected={vehicleType === "BUS"}
            disabled={!priceReady}
            title={t("vehicleBus")}
            revealPrice={form.vehicleManuallyChosen && vehicleType === "BUS"}
            price={busPrice}
            onSelect={() => selectVehicle("BUS")}
          />
        </div>
        {carQuoteError && (
          <p role="alert" className="flex items-center justify-between gap-3 text-xs font-medium text-red-600">
            {t("quoteError")}
            <button type="button" onClick={onRetryCarQuote} className="underline hover:no-underline">
              {t("retryButton")}
            </button>
          </p>
        )}
        {showAutoSwitchNote && (
          <p className="text-xs text-muted">{t("vehicleAutoSwitchNote")}</p>
        )}
      </fieldset>

      {isAirport && (
        <Field
          label={t("flightNumberLabel")}
          htmlFor="flightNumber"
          hint={t("flightNumberHint")}
        >
          <input
            id="flightNumber"
            className={inputClassName}
            placeholder={t("flightNumberPlaceholder")}
            value={form.flightNumber}
            onChange={(e) => onChange({ flightNumber: e.target.value })}
          />
        </Field>
      )}

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
          disabled={!canContinue}
          onClick={onNext}
          className="flex-1 rounded-full bg-brand px-5 py-3 text-base font-semibold text-brand-foreground shadow-sm transition enabled:hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("calculateButton")}
        </button>
      </div>
    </div>
  );
}

function VehicleOption({
  id,
  selected,
  disabled,
  title,
  price,
  revealPrice,
  onSelect,
}: {
  id: string;
  selected: boolean;
  disabled?: boolean;
  title: string;
  /** null while the real price is still loading (or failed) — see carQuoteLoading/carQuoteError above. */
  price: number | null;
  /**
   * Only show a price at all once the customer has actively chosen
   * THIS vehicle — never two prices side by side, and never before a
   * deliberate click. When false, the button shows just its title, no
   * price and no loading skeleton (there's nothing to reveal yet).
   */
  revealPrice: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      id={id}
      disabled={disabled}
      aria-pressed={selected}
      onClick={onSelect}
      className={[
        "flex items-center justify-between gap-2 rounded-lg border px-3.5 py-3 text-left transition",
        selected
          ? "border-brand bg-brand/5 ring-1 ring-brand"
          : "border-border hover:border-brand/50",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      <span className="text-sm font-semibold text-foreground">{title}</span>
      {revealPrice && (
        <span className="text-sm font-bold text-brand">
          {price != null ? `€${price}` : (
            <span className="inline-block h-3.5 w-8 animate-pulse rounded bg-brand/20" aria-hidden="true" />
          )}
        </span>
      )}
    </button>
  );
}
