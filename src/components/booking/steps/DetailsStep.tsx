"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Field, inputClassName } from "@/components/ui/Field";
import { detectRideType } from "@/lib/rideType";
import { BUS_SURCHARGE_EUR, calculateQuote, recommendedVehicle } from "@/lib/pricing";
import type { BookingFormState } from "../types";

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
  const rideType = detectRideType(form.pickup, form.destination);
  const isAirport = rideType === "AIRPORT_TRANSFER";

  const recommended = recommendedVehicle(form.passengers, form.luggage);
  // Auto-switch the vehicle when capacity requires it, unless the
  // customer already picked one themselves — see lib/pricing/vehicle.ts.
  const vehicleType = form.vehicleManuallyChosen ? form.vehicleType : recommended;
  const showAutoSwitchNote = !form.vehicleManuallyChosen && recommended === "BUS";

  // calculateQuote is a pure, client-safe function (no server/DB
  // imports — see lib/pricing/index.ts), so we can preview the real
  // per-vehicle price right here instead of waiting for the "Bereken
  // vaste prijs" step. Base price doesn't depend on passengers/date/
  // etc., only on pickup/destination, so this only recomputes when
  // those actually change. The customer only ever sees the two final
  // amounts (e.g. "€50" / "€65") — never the underlying "+€15" math.
  const carPrice = useMemo(
    () => calculateQuote({ pickup: form.pickup, destination: form.destination, vehicleType: "PERSONENAUTO" }).basePrice,
    [form.pickup, form.destination]
  );
  const busPrice = carPrice + BUS_SURCHARGE_EUR;

  const canContinue = form.date.length > 0 && form.time.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <fieldset className="rounded-lg border border-border p-3.5">
        <legend className="px-1 text-sm font-medium text-foreground">
          {t("whenHeading")}
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={t("dateLabel")} htmlFor="date">
            <input
              id="date"
              type="date"
              className={inputClassName}
              value={form.date}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => onChange({ date: e.target.value })}
            />
          </Field>
          <Field label={t("timeLabel")} htmlFor="time">
            <input
              id="time"
              type="time"
              className={inputClassName}
              value={form.time}
              onChange={(e) => onChange({ time: e.target.value })}
            />
          </Field>
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <Field label={t("passengersLabel")} htmlFor="passengers">
          <input
            id="passengers"
            type="number"
            min={1}
            max={8}
            className={inputClassName}
            value={form.passengers}
            onChange={(e) => onChange({ passengers: Number(e.target.value) || 1 })}
          />
        </Field>
        <Field label={t("luggageLabel")} htmlFor="luggage">
          <input
            id="luggage"
            type="number"
            min={0}
            max={8}
            className={inputClassName}
            value={form.luggage}
            onChange={(e) => onChange({ luggage: Number(e.target.value) || 0 })}
          />
        </Field>
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
            subtitle={t("vehiclePersonenautoHint")}
            price={carPrice}
            onSelect={() =>
              onChange({ vehicleType: "PERSONENAUTO", vehicleManuallyChosen: true })
            }
          />
          <VehicleOption
            id="vehicle-bus"
            selected={vehicleType === "BUS"}
            title={t("vehicleBus")}
            subtitle={t("vehicleBusHint")}
            price={busPrice}
            onSelect={() => onChange({ vehicleType: "BUS", vehicleManuallyChosen: true })}
          />
        </div>
        {showAutoSwitchNote && (
          <p className="text-xs text-muted">
            {t("vehicleAutoSwitchNote", { passengers: 5 })}
          </p>
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
  subtitle,
  price,
  onSelect,
}: {
  id: string;
  selected: boolean;
  disabled?: boolean;
  title: string;
  subtitle: string;
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
        "rounded-lg border px-3.5 py-2.5 text-left transition",
        selected
          ? "border-brand bg-brand/5 ring-1 ring-brand"
          : "border-border hover:border-brand/50",
        disabled ? "cursor-not-allowed opacity-40" : "",
      ].join(" ")}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="text-sm font-bold text-brand">€{price}</span>
      </span>
      <span className="block text-xs text-muted">{subtitle}</span>
    </button>
  );
}
