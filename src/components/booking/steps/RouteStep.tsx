"use client";

import { useTranslations, useLocale } from "next-intl";
import { LOCATIONS } from "@/lib/locations";
import { Field, inputClassName } from "@/components/ui/Field";
import type { BookingFormState } from "../types";

/**
 * Pickup/destination as free-text inputs backed by a <datalist> of
 * curated NL locations — native browser autocomplete, zero JS library.
 * The customer can still type anything; the list only offers
 * suggestions. See lib/locations.ts for why (no Google Places yet).
 */
export function RouteStep({
  form,
  onChange,
  onNext,
}: {
  form: BookingFormState;
  onChange: (patch: Partial<BookingFormState>) => void;
  onNext: () => void;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale() as "nl" | "en";
  const canContinue = form.pickup.trim().length > 1 && form.destination.trim().length > 1;

  return (
    <div className="flex flex-col gap-4">
      <datalist id="ams-locations">
        {LOCATIONS.map((location) => (
          <option key={location.id} value={location.label[locale]} />
        ))}
      </datalist>

      <Field label={t("pickupLabel")} htmlFor="pickup">
        <input
          id="pickup"
          list="ams-locations"
          className={inputClassName}
          placeholder={t("pickupPlaceholder")}
          value={form.pickup}
          onChange={(e) => onChange({ pickup: e.target.value })}
          autoComplete="off"
        />
      </Field>

      <Field label={t("destinationLabel")} htmlFor="destination">
        <input
          id="destination"
          list="ams-locations"
          className={inputClassName}
          placeholder={t("destinationPlaceholder")}
          value={form.destination}
          onChange={(e) => onChange({ destination: e.target.value })}
          autoComplete="off"
        />
      </Field>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onNext}
        className="mt-1 w-full rounded-full bg-brand px-5 py-3 text-base font-semibold text-brand-foreground shadow-sm transition enabled:hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("nextButton")}
      </button>
    </div>
  );
}
