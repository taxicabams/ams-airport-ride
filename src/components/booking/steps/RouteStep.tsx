"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AddressField } from "@/components/ui/AddressField";
import { PlaneIcon, ArrowRightIcon } from "@/components/ui/icons";
import type { ResolvedPlace } from "@/lib/places";
import type { BookingFormState } from "../types";

// Real, correct Schiphol coordinates — the exact same values already
// used for ride-type detection/distance estimates in lib/locations.ts's
// "schiphol" entry. Setting these directly (rather than round-tripping
// through Google Places) is safe because pricing never depends on
// Places coordinates for a Schiphol leg: calculateQuote() matches the
// *text* "Schiphol Airport" against that same curated location to find
// the fixed price (see lib/pricing/index.ts) — a synthetic placeId here
// changes nothing about how the ride is priced or booked.
const SCHIPHOL_DESTINATION = {
  placeId: "schiphol-airport-fixed",
  lat: 52.3105,
  lng: 4.7683,
} as const;

type RideMode = "schiphol" | "other";

/**
 * v10 rebuild: the client's new mockup shows an explicit "Naar Schiphol /
 * Andere rit" tab pair, with the Schiphol destination pre-filled and
 * locked rather than typed. Reuses the exact same underlying
 * detection/pricing this app already had (a Schiphol-bound ride is
 * whichever leg matches lib/locations.ts's "schiphol" entry) — this tab
 * is a presentational shortcut for the single most common case, not new
 * booking logic. "Andere rit" is the unchanged, unrestricted free-text
 * flow for both fields.
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
  // Default to the "schiphol" tab unless the form already holds a
  // destination that's clearly something else (e.g. the customer came
  // back here after picking "Andere rit") — a reasonable one-time guess,
  // not persisted logic.
  const [rideMode, setRideMode] = useState<RideMode>(() =>
    form.destination && !form.destination.toLowerCase().includes("schiphol") ? "other" : "schiphol"
  );

  const pickupResolved = Boolean(form.pickupPlaceId);
  const destinationResolved = Boolean(form.destinationPlaceId);
  const pickupNeedsHouseNumber = pickupResolved && form.pickupMissingHouseNumber === true;
  const destinationNeedsHouseNumber = destinationResolved && form.destinationMissingHouseNumber === true;
  const canContinue =
    pickupResolved && destinationResolved && !pickupNeedsHouseNumber && !destinationNeedsHouseNumber;

  // "schiphol" is the default tab, selected before the customer ever
  // clicks anything — without this, the destination pill would show
  // "Schiphol Airport" visually while form.destinationPlaceId stayed
  // unset (only selectRideMode's click handler wrote it), silently
  // leaving Next permanently disabled on the single most common path.
  // Found live while re-testing this step after the rebuild.
  useEffect(() => {
    if (rideMode === "schiphol" && form.destinationPlaceId !== SCHIPHOL_DESTINATION.placeId) {
      onChange({
        destination: t("schipholDestinationLabel"),
        destinationPlaceId: SCHIPHOL_DESTINATION.placeId,
        destinationLat: SCHIPHOL_DESTINATION.lat,
        destinationLng: SCHIPHOL_DESTINATION.lng,
        destinationMissingHouseNumber: false,
      });
    }
    // Only re-run when the tab itself changes — onChange/t/form are not
    // stable references across renders and would cause a render loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rideMode]);

  function resolvePickup(place: ResolvedPlace | null) {
    onChange({
      pickupPlaceId: place?.placeId,
      pickupLat: place?.lat,
      pickupLng: place?.lng,
      pickupMissingHouseNumber: place?.missingHouseNumber ?? false,
    });
    // Surface the house-number message right away — don't make the
    // customer blur the field first to discover why Next stays disabled.
    if (place?.missingHouseNumber) setTouched((s) => ({ ...s, pickup: true }));
  }

  function resolveDestination(place: ResolvedPlace | null) {
    onChange({
      destinationPlaceId: place?.placeId,
      destinationLat: place?.lat,
      destinationLng: place?.lng,
      destinationMissingHouseNumber: place?.missingHouseNumber ?? false,
    });
    if (place?.missingHouseNumber) setTouched((s) => ({ ...s, destination: true }));
  }

  function selectRideMode(mode: RideMode) {
    setRideMode(mode);
    // Switching TO "schiphol" is handled by the useEffect above (which
    // also covers the initial default-tab case) — only the "other"
    // cleanup needs to happen here, synchronously, on the click itself.
    if (mode === "other") {
      // Only clear it if it's still the locked Schiphol value — never
      // wipe something the customer already typed for "Andere rit".
      if (form.destinationPlaceId === SCHIPHOL_DESTINATION.placeId) {
        onChange({
          destination: "",
          destinationPlaceId: undefined,
          destinationLat: undefined,
          destinationLng: undefined,
          destinationMissingHouseNumber: undefined,
        });
      }
    }
  }

  const pickupError =
    touched.pickup && form.pickup.trim().length > 0
      ? pickupNeedsHouseNumber
        ? t("addressHouseNumberRequired")
        : !pickupResolved
          ? t("addressSelectRequired")
          : undefined
      : undefined;
  const destinationError =
    touched.destination && form.destination.trim().length > 0
      ? destinationNeedsHouseNumber
        ? t("addressHouseNumberRequired")
        : !destinationResolved
          ? t("addressSelectRequired")
          : undefined
      : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-muted-background p-1"
      >
        <button
          type="button"
          role="tab"
          aria-selected={rideMode === "schiphol"}
          onClick={() => selectRideMode("schiphol")}
          className={[
            "flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-semibold transition",
            rideMode === "schiphol"
              ? "bg-ink text-white shadow-sm"
              : "text-muted hover:text-foreground",
          ].join(" ")}
        >
          <PlaneIcon className="h-4 w-4" />
          {t("tabToSchiphol")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={rideMode === "other"}
          onClick={() => selectRideMode("other")}
          className={[
            "flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold transition",
            rideMode === "other"
              ? "bg-ink text-white shadow-sm"
              : "text-muted hover:text-foreground",
          ].join(" ")}
        >
          {t("tabOtherRide")}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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

        {rideMode === "schiphol" ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">{t("destinationLabel")}</label>
            <div className="flex min-h-[46px] items-center gap-2 rounded-lg border border-border bg-muted-background px-3.5 py-2.5 text-base text-foreground">
              <PlaneIcon className="h-4 w-4 shrink-0 text-brand-text" />
              {t("schipholDestinationLabel")}
            </div>
          </div>
        ) : (
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
        )}
      </div>

      <button
        type="button"
        disabled={!canContinue}
        onClick={onNext}
        className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition enabled:hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("nextButton")}
        <ArrowRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
