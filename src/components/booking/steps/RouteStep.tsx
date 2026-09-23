"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AddressField } from "@/components/ui/AddressField";
import type { ResolvedPlace } from "@/lib/places";
import type { BookingFormState } from "../types";

/**
 * Real Google Places Autocomplete for pickup/destination (Phase 2A) —
 * see the plan for why this replaced the free-text + <datalist>
 * pattern. The customer must pick an actual suggestion; typing alone
 * (e.g. "West") is deliberately never accepted as a valid address —
 * see `resolved` below and AddressField's onResolve contract.
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
  const [touched, setTouched] = useState<{ pickup?: boolean; destination?: boolean }>({});

  const pickupResolved = Boolean(form.pickupPlaceId);
  const destinationResolved = Boolean(form.destinationPlaceId);
  const canContinue = pickupResolved && destinationResolved;

  function resolvePickup(place: ResolvedPlace | null) {
    onChange({
      pickupPlaceId: place?.placeId,
      pickupLat: place?.lat,
      pickupLng: place?.lng,
    });
  }

  function resolveDestination(place: ResolvedPlace | null) {
    onChange({
      destinationPlaceId: place?.placeId,
      destinationLat: place?.lat,
      destinationLng: place?.lng,
    });
  }

  const pickupError =
    touched.pickup && form.pickup.trim().length > 0 && !pickupResolved
      ? t("addressSelectRequired")
      : undefined;
  const destinationError =
    touched.destination && form.destination.trim().length > 0 && !destinationResolved
      ? t("addressSelectRequired")
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div onBlur={() => setTouched((s) => ({ ...s, pickup: true }))}>
        <AddressField
          id="pickup"
          label={t("pickupLabel")}
          placeholder={t("pickupPlaceholder")}
          value={form.pickup}
          onChange={(value) => onChange({ pickup: value })}
          onResolve={resolvePickup}
          locale={locale}
          error={pickupError}
          loadingLabel={t("addressLoading")}
          noResultsLabel={t("addressNoResults")}
          notConfiguredLabel={t("addressNotConfigured")}
          unavailableLabel={t("addressUnavailable")}
        />
      </div>

      <div onBlur={() => setTouched((s) => ({ ...s, destination: true }))}>
        <AddressField
          id="destination"
          label={t("destinationLabel")}
          placeholder={t("destinationPlaceholder")}
          value={form.destination}
          onChange={(value) => onChange({ destination: value })}
          onResolve={resolveDestination}
          locale={locale}
          error={destinationError}
          loadingLabel={t("addressLoading")}
          noResultsLabel={t("addressNoResults")}
          notConfiguredLabel={t("addressNotConfigured")}
          unavailableLabel={t("addressUnavailable")}
        />
      </div>

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
