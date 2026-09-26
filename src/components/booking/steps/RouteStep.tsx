"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AddressField } from "@/components/ui/AddressField";
import { RouteDotIcon } from "@/components/ui/icons";
import type { ResolvedPlace } from "@/lib/places";
import type { BookingFormState } from "../types";

/**
 * v9 rebuild: pickup/destination are wrapped in a visual "route" frame —
 * a connecting vertical line with a filled dot at pickup and an outlined
 * ring at destination — instead of two plain stacked fields. This is the
 * client's own explicit spec ("● Van / │ / ● Naar") for making the two
 * most important fields in the whole product visually read as one
 * connected trip, not just two form rows among others.
 *
 * Google Places Autocomplete logic (Phase 2A) is unchanged — the customer
 * must pick an actual suggestion; typing alone is never a valid address.
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
      <div className="relative flex flex-col gap-3">
        {/* The connecting line + two stops — purely decorative, absolutely
            positioned so it never affects the fields' own layout/width. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-[11px] top-6 w-px bg-border"
        />
        <div className="relative flex items-start gap-3">
          <span className="mt-9 flex h-[22px] w-[22px] shrink-0 items-center justify-center">
            <RouteDotIcon className="h-2.5 w-2.5 text-brand" />
          </span>
          <div className="min-w-0 flex-1" onBlur={() => setTouched((s) => ({ ...s, pickup: true }))}>
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
        </div>

        <div className="relative flex items-start gap-3">
          <span className="mt-9 flex h-[22px] w-[22px] shrink-0 items-center justify-center">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-brand" />
          </span>
          <div className="min-w-0 flex-1" onBlur={() => setTouched((s) => ({ ...s, destination: true }))}>
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
        </div>
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onNext}
        className="mt-1 w-full rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition enabled:hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("nextButton")}
      </button>
    </div>
  );
}
