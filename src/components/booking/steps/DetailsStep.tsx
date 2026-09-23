"use client";

import { useEffect, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Field, inputClassName } from "@/components/ui/Field";
import { PickerField } from "@/components/ui/PickerField";
import { Stepper } from "@/components/ui/Stepper";
import { detectRideType } from "@/lib/rideType";
import {
  BUS_SURCHARGE_EUR,
  BUS_MAX_PASSENGERS,
  BUS_MAX_LUGGAGE,
  calculateQuote,
  recommendedVehicle,
} from "@/lib/pricing";
import { track } from "@/lib/analytics";
import type { BookingFormState } from "../types";

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export function DetailsStep({
  form,
  onChange,
  onBack,
  onNext,
}: {
  form: BookingFormState;
  onChange: (patch: Partial<BookingFormState>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const rideType = detectRideType(form.pickup, form.destination);
  const isAirport = rideType === "AIRPORT_TRANSFER";

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

  // calculateQuote is a pure, client-safe function (no server/DB
  // imports — see lib/pricing/index.ts), so we can preview the real
  // per-vehicle price right here instead of waiting for the "Bereken
  // vaste prijs" step. Base price doesn't depend on passengers/date/
  // etc., only on pickup/destination, so this only recomputes when
  // those actually change. The customer only ever sees the two final
  // amounts (e.g. "€50" / "€65") — never the underlying "+€15" math or
  // any technical seat-count text.
  const carPrice = useMemo(
    () => calculateQuote({ pickup: form.pickup, destination: form.destination, vehicleType: "PERSONENAUTO" }).basePrice,
    [form.pickup, form.destination]
  );
  const busPrice = carPrice + BUS_SURCHARGE_EUR;

  const dateDisplay = form.date
    ? new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short" }).format(
        new Date(`${form.date}T00:00:00`)
      )
    : "";

  const canContinue = form.date.length > 0 && form.time.length > 0;

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
            disabled={recommended === "BUS"}
            title={t("vehiclePersonenauto")}
            price={carPrice}
            onSelect={() => selectVehicle("PERSONENAUTO")}
          />
          <VehicleOption
            id="vehicle-bus"
            selected={vehicleType === "BUS"}
            title={t("vehicleBus")}
            price={busPrice}
            onSelect={() => selectVehicle("BUS")}
          />
        </div>
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
  onSelect,
}: {
  id: string;
  selected: boolean;
  disabled?: boolean;
  title: string;
  price: number;
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
      <span className="text-sm font-bold text-brand">€{price}</span>
    </button>
  );
}
