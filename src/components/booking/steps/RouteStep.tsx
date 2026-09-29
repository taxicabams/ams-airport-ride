"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { AddressField } from "@/components/ui/AddressField";
import { inputClassName } from "@/components/ui/Field";
import { PlaneIcon, ArrowRightIcon, SwapIcon } from "@/components/ui/icons";
import type { ResolvedPlace } from "@/lib/places";
import { STOPOVER_SURCHARGE_EUR } from "@/lib/pricing";
import type { BookingFormState } from "../types";

// Real, correct Schiphol coordinates — the exact same values already
// used for ride-type detection/distance estimates in lib/locations.ts's
// "schiphol" entry. Setting these directly (rather than round-tripping
// through Google Places) is safe because pricing never depends on
// Places coordinates for a Schiphol leg: calculateQuote() matches the
// *text* "Schiphol Airport" against that same curated location to find
// the fixed price (see lib/pricing/index.ts) — a synthetic placeId here
// changes nothing about how the ride is priced or booked.
const SCHIPHOL = {
  placeId: "schiphol-airport-fixed",
  lat: 52.3105,
  lng: 4.7683,
} as const;

type RideMode = "toSchiphol" | "fromSchiphol" | "other";

/**
 * Splices a house number into a Google-formatted address that resolved
 * without one — e.g. "Damrak, 1012 LP Amsterdam, Netherlands" + "1" ->
 * "Damrak 1, 1012 LP Amsterdam, Netherlands". Google's formatted_address
 * convention puts the street name first, before the first comma, so
 * inserting right there is correct for the vast majority of real
 * addresses. Real bug found live this session: customers found it
 * awkward/confusing to edit the house number back into the same text
 * field a suggestion had just filled in — this gives them a small,
 * separate, single-purpose input instead.
 */
function insertHouseNumber(formattedAddress: string, houseNumber: string): string {
  const commaIndex = formattedAddress.indexOf(",");
  if (commaIndex === -1) return `${formattedAddress} ${houseNumber}`;
  return `${formattedAddress.slice(0, commaIndex)} ${houseNumber}${formattedAddress.slice(commaIndex)}`;
}

/**
 * Three explicit modes instead of the earlier two-tab "Naar Schiphol /
 * Andere rit" version: the client's own audit pointed out that a
 * Schiphol *arrival* ("vanaf Schiphol") deserves to be exactly as easy
 * to pick as a Schiphol *departure* ("naar Schiphol") — not a variant of
 * "other". Same underlying mechanism either way: a locked Schiphol
 * field on whichever side applies, using the real Schiphol coordinates
 * already used for ride-type detection elsewhere — never new booking
 * logic, just which field the lock applies to. "Andere rit" (both
 * fields free) is kept, unchanged, for the private Amsterdam/NL rides
 * the rest of the site still markets.
 *
 * Default tab is "fromSchiphol": the client's own brief names arriving
 * *from* Schiphol as audience #1 and the commercially most important
 * case, and explicitly says the default doesn't have to be "naar
 * Schiphol".
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
  const [touched, setTouched] = useState<{ pickup?: boolean; destination?: boolean; stopover?: boolean }>({});
  const [pickupHouseNumber, setPickupHouseNumber] = useState("");
  const [destinationHouseNumber, setDestinationHouseNumber] = useState("");
  const [stopoverHouseNumber, setStopoverHouseNumber] = useState("");
  // Real bug found live: committing the house number into form state on
  // every keystroke (so after typing just "1" of "12") immediately set
  // pickupMissingHouseNumber to false — which hid this very input
  // (rendered only while that flag is true) after one digit, and let
  // "Volgende" enable before the number was actually finished. Showing
  // the field is now driven by this separate, stable flag instead of
  // the live derived one, and the value only commits to form state on
  // blur/Enter (see commitPickupHouseNumber) — never mid-keystroke — so
  // any number of digits and suffixes ("12", "12a", "12-1", ...) can be
  // typed freely before anything is considered "resolved."
  const [pickupHouseNumberActive, setPickupHouseNumberActive] = useState(false);
  const [destinationHouseNumberActive, setDestinationHouseNumberActive] = useState(false);
  const [stopoverHouseNumberActive, setStopoverHouseNumberActive] = useState(false);
  const [rideMode, setRideMode] = useState<RideMode>(() => {
    if (form.pickup.toLowerCase().includes("schiphol")) return "fromSchiphol";
    if (form.destination.toLowerCase().includes("schiphol")) return "toSchiphol";
    if (form.pickup || form.destination) return "other";
    return "fromSchiphol";
  });

  const pickupResolved = Boolean(form.pickupPlaceId);
  const destinationResolved = Boolean(form.destinationPlaceId);
  const pickupNeedsHouseNumber = pickupResolved && form.pickupMissingHouseNumber === true;
  const destinationNeedsHouseNumber = destinationResolved && form.destinationMissingHouseNumber === true;
  const stopoverResolved = Boolean(form.stopoverPlaceId);
  const stopoverNeedsHouseNumber = stopoverResolved && form.stopoverMissingHouseNumber === true;
  // A stopover only has to block Next while it's actually turned on —
  // toggling it off (or never turning it on) never blocks the flow.
  const stopoverBlocking = form.hasStopover && (!stopoverResolved || stopoverNeedsHouseNumber);
  const canContinue =
    pickupResolved &&
    destinationResolved &&
    !pickupNeedsHouseNumber &&
    !destinationNeedsHouseNumber &&
    !stopoverBlocking;

  // Keeps form state in sync with whichever side should be locked to
  // Schiphol for the current tab — including on mount for the default
  // tab, not just on an explicit click. (A mount-only click handler
  // missed this exact case in an earlier pass: the default tab looked
  // right but never actually wrote destinationPlaceId, so Next stayed
  // permanently disabled on the single most common path.)
  useEffect(() => {
    if (rideMode === "toSchiphol" && form.destinationPlaceId !== SCHIPHOL.placeId) {
      onChange({
        destination: t("schipholDestinationLabel"),
        destinationPlaceId: SCHIPHOL.placeId,
        destinationLat: SCHIPHOL.lat,
        destinationLng: SCHIPHOL.lng,
        destinationMissingHouseNumber: false,
      });
    }
    if (rideMode === "fromSchiphol" && form.pickupPlaceId !== SCHIPHOL.placeId) {
      onChange({
        pickup: t("schipholDestinationLabel"),
        pickupPlaceId: SCHIPHOL.placeId,
        pickupLat: SCHIPHOL.lat,
        pickupLng: SCHIPHOL.lng,
        pickupMissingHouseNumber: false,
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
    if (place?.missingHouseNumber) {
      setTouched((s) => ({ ...s, pickup: true }));
      setPickupHouseNumberActive(true);
    } else {
      setPickupHouseNumber(""); // fresh resolution, any earlier number no longer applies
      setPickupHouseNumberActive(false);
    }
  }

  function resolveDestination(place: ResolvedPlace | null) {
    onChange({
      destinationPlaceId: place?.placeId,
      destinationLat: place?.lat,
      destinationLng: place?.lng,
      destinationMissingHouseNumber: place?.missingHouseNumber ?? false,
    });
    if (place?.missingHouseNumber) {
      setTouched((s) => ({ ...s, destination: true }));
      setDestinationHouseNumberActive(true);
    } else {
      setDestinationHouseNumber("");
      setDestinationHouseNumberActive(false);
    }
  }

  function resolveStopover(place: ResolvedPlace | null) {
    onChange({
      stopoverPlaceId: place?.placeId,
      stopoverLat: place?.lat,
      stopoverLng: place?.lng,
      stopoverMissingHouseNumber: place?.missingHouseNumber ?? false,
    });
    if (place?.missingHouseNumber) {
      setTouched((s) => ({ ...s, stopover: true }));
      setStopoverHouseNumberActive(true);
    } else {
      setStopoverHouseNumber("");
      setStopoverHouseNumberActive(false);
    }
  }

  // Applied from the separate "Huisnummer" field below (see
  // insertHouseNumber's own note) — never from editing the address text
  // itself, which is still Google-autocomplete-only. Only commits on
  // blur/Enter (see the input's own handlers below), never mid-
  // keystroke — see the pickupHouseNumberActive note above for why.
  function commitPickupHouseNumber() {
    if (pickupHouseNumber.trim().length === 0) return;
    onChange({
      pickup: insertHouseNumber(form.pickup, pickupHouseNumber.trim()),
      pickupMissingHouseNumber: false,
    });
    setPickupHouseNumberActive(false);
  }

  function commitDestinationHouseNumber() {
    if (destinationHouseNumber.trim().length === 0) return;
    onChange({
      destination: insertHouseNumber(form.destination, destinationHouseNumber.trim()),
      destinationMissingHouseNumber: false,
    });
    setDestinationHouseNumberActive(false);
  }

  function commitStopoverHouseNumber() {
    if (stopoverHouseNumber.trim().length === 0) return;
    onChange({
      stopover: insertHouseNumber(form.stopover, stopoverHouseNumber.trim()),
      stopoverMissingHouseNumber: false,
    });
    setStopoverHouseNumberActive(false);
  }

  // Turning the stopover off clears its resolved state entirely (not
  // just hiding the field) — an old stopover address must never keep
  // silently adding its surcharge once the customer has unchecked it.
  function toggleStopover(enabled: boolean) {
    onChange({
      hasStopover: enabled,
      ...(enabled
        ? {}
        : {
            stopover: "",
            stopoverPlaceId: undefined,
            stopoverLat: undefined,
            stopoverLng: undefined,
            stopoverMissingHouseNumber: undefined,
          }),
    });
    if (!enabled) {
      setStopoverHouseNumber("");
      setStopoverHouseNumberActive(false);
    }
  }

  // Real, working swap — not shown for the two Schiphol-locked tabs
  // (swapping there is just "pick the other tab," already handled by
  // the toggle above; a swap button would be confusing, not useful).
  function swapAddresses() {
    onChange({
      pickup: form.destination,
      pickupPlaceId: form.destinationPlaceId,
      pickupLat: form.destinationLat,
      pickupLng: form.destinationLng,
      pickupMissingHouseNumber: form.destinationMissingHouseNumber,
      destination: form.pickup,
      destinationPlaceId: form.pickupPlaceId,
      destinationLat: form.pickupLat,
      destinationLng: form.pickupLng,
      destinationMissingHouseNumber: form.pickupMissingHouseNumber,
    });
    setPickupHouseNumber(destinationHouseNumber);
    setDestinationHouseNumber(pickupHouseNumber);
    setTouched({});
  }

  function selectRideMode(mode: RideMode) {
    setRideMode(mode);
    // Locking TO a Schiphol side is handled by the useEffect above
    // (which also covers the initial default-tab case). Only clearing a
    // side that's no longer locked needs to happen here, synchronously,
    // on the click itself — and only if it still holds the locked
    // value, never wiping something the customer already typed.
    if (mode !== "toSchiphol" && form.destinationPlaceId === SCHIPHOL.placeId) {
      onChange({
        destination: "",
        destinationPlaceId: undefined,
        destinationLat: undefined,
        destinationLng: undefined,
        destinationMissingHouseNumber: undefined,
      });
    }
    if (mode !== "fromSchiphol" && form.pickupPlaceId === SCHIPHOL.placeId) {
      onChange({
        pickup: "",
        pickupPlaceId: undefined,
        pickupLat: undefined,
        pickupLng: undefined,
        pickupMissingHouseNumber: undefined,
      });
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
  const stopoverError =
    touched.stopover && form.stopover.trim().length > 0
      ? stopoverNeedsHouseNumber
        ? t("addressHouseNumberRequired")
        : !stopoverResolved
          ? t("addressSelectRequired")
          : undefined
      : undefined;

  const tabs: { mode: RideMode; label: string }[] = [
    { mode: "fromSchiphol", label: t("tabFromSchiphol") },
    { mode: "toSchiphol", label: t("tabToSchiphol") },
    { mode: "other", label: t("tabOtherRide") },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div
        role="tablist"
        className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-muted-background p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.mode}
            type="button"
            role="tab"
            aria-selected={rideMode === tab.mode}
            onClick={() => selectRideMode(tab.mode)}
            className={[
              "flex min-h-11 items-center justify-center rounded-lg px-2 text-center text-xs font-semibold leading-tight transition sm:text-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
              rideMode === tab.mode
                ? "bg-ink text-white shadow-sm"
                : "text-muted hover:text-foreground",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {rideMode === "other" && (form.pickup || form.destination) && (
        <button
          type="button"
          onClick={swapAddresses}
          className="flex items-center gap-1.5 self-end text-xs font-semibold text-brand-text transition hover:text-brand-dark"
        >
          <SwapIcon className="h-3.5 w-3.5" />
          {t("swapLabel")}
        </button>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {rideMode === "fromSchiphol" ? (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">{t("pickupLabel")}</label>
            <div className="flex min-h-[46px] items-center gap-2 rounded-lg border border-border bg-muted-background px-3.5 py-2.5 text-base text-foreground">
              <PlaneIcon className="h-4 w-4 shrink-0 text-brand-text" />
              {t("schipholDestinationLabel")}
            </div>
          </div>
        ) : (
          <div onBlur={() => setTouched((s) => ({ ...s, pickup: true }))}>
            <AddressField
              id="pickup"
              label={t("pickupLabel")}
              placeholder={t("pickupPlaceholder")}
              value={form.pickup}
              onChange={(value) => onChange({ pickup: value })}
              onResolve={resolvePickup}
              locale={locale}
              error={pickupNeedsHouseNumber ? undefined : pickupError}
              loadingLabel={t("addressLoading")}
              noResultsLabel={t("addressNoResults")}
              notConfiguredLabel={t("addressNotConfigured")}
              unavailableLabel={t("addressUnavailable")}
            />
            {/* Separate from the Google-autocomplete text field on
                purpose — real feedback this session: typing a house
                number back into the same field a suggestion just filled
                in was awkward and confusing. Any number of digits and
                any suffix ("12", "12a", "12-1", ...) can be typed freely
                — it only commits on blur or Enter, never mid-keystroke
                (see commitPickupHouseNumber's own note on the real bug
                this fixes). */}
            {pickupHouseNumberActive && (
              <div className="mt-1.5">
                <label htmlFor="pickup-housenumber" className="text-sm font-medium text-foreground">
                  {t("houseNumberLabel")}
                </label>
                <input
                  id="pickup-housenumber"
                  className={inputClassName}
                  placeholder={t("houseNumberPlaceholder")}
                  value={pickupHouseNumber}
                  autoFocus
                  onChange={(e) => setPickupHouseNumber(e.target.value)}
                  onBlur={commitPickupHouseNumber}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitPickupHouseNumber();
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        {rideMode === "toSchiphol" ? (
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
              error={destinationNeedsHouseNumber ? undefined : destinationError}
              loadingLabel={t("addressLoading")}
              noResultsLabel={t("addressNoResults")}
              notConfiguredLabel={t("addressNotConfigured")}
              unavailableLabel={t("addressUnavailable")}
            />
            {destinationHouseNumberActive && (
              <div className="mt-1.5">
                <label htmlFor="destination-housenumber" className="text-sm font-medium text-foreground">
                  {t("houseNumberLabel")}
                </label>
                <input
                  id="destination-housenumber"
                  className={inputClassName}
                  placeholder={t("houseNumberPlaceholder")}
                  value={destinationHouseNumber}
                  autoFocus
                  onChange={(e) => setDestinationHouseNumber(e.target.value)}
                  onBlur={commitDestinationHouseNumber}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      commitDestinationHouseNumber();
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Optional stopover — client request: "doe ook tussenstop maar
          bedenk hoe ik dat kan fiksen in me prijs." Priced as a flat
          surcharge (STOPOVER_SURCHARGE_EUR, see lib/pricing/vehicle.ts)
          rather than a real extra-distance calculation — the app has no
          live multi-waypoint routing integration, so a flat, told-
          upfront amount is what keeps "vaste prijs vooraf" honest here
          too. Off by default; turning it on requires a fully resolved
          address here too, same rule as pickup/destination. */}
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-brand-text focus:ring-brand/40"
          checked={form.hasStopover}
          onChange={(e) => toggleStopover(e.target.checked)}
        />
        {t("stopoverToggleLabel", { surcharge: STOPOVER_SURCHARGE_EUR })}
      </label>

      {form.hasStopover && (
        <div onBlur={() => setTouched((s) => ({ ...s, stopover: true }))}>
          <AddressField
            id="stopover"
            label={t("stopoverLabel")}
            placeholder={t("stopoverPlaceholder")}
            value={form.stopover}
            onChange={(value) => onChange({ stopover: value })}
            onResolve={resolveStopover}
            locale={locale}
            error={stopoverNeedsHouseNumber ? undefined : stopoverError}
            loadingLabel={t("addressLoading")}
            noResultsLabel={t("addressNoResults")}
            notConfiguredLabel={t("addressNotConfigured")}
            unavailableLabel={t("addressUnavailable")}
          />
          {stopoverHouseNumberActive && (
            <div className="mt-1.5">
              <label htmlFor="stopover-housenumber" className="text-sm font-medium text-foreground">
                {t("houseNumberLabel")}
              </label>
              <input
                id="stopover-housenumber"
                className={inputClassName}
                placeholder={t("houseNumberPlaceholder")}
                value={stopoverHouseNumber}
                autoFocus
                onChange={(e) => setStopoverHouseNumber(e.target.value)}
                onBlur={commitStopoverHouseNumber}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitStopoverHouseNumber();
                  }
                }}
              />
            </div>
          )}
        </div>
      )}

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
