"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getSchipholMeetingPointText } from "@/lib/schipholMeetingPoint";
import { companyInfo } from "@/lib/companyInfo";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { WhatsAppIcon } from "@/components/ui/icons";
import type { BookingResult } from "./types";

export function ConfirmationCard({ result }: { result: BookingResult }) {
  const t = useTranslations("Confirmation");
  const tb = useTranslations("Booking");
  // Reuses the homepage's payment/receipt copy (PaymentTrust) instead of
  // a duplicate key — one message to keep in sync, not two.
  const tp = useTranslations("PaymentTrust");
  const locale = useLocale() as "nl" | "en";
  const { form, quote, returnQuote, totalPrice, bookingId } = result;
  const isAirport = quote.rideType === "AIRPORT_TRANSFER";

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
          ✓
        </div>
        <h3 className="mt-3 text-xl font-semibold text-foreground">{t("title")}</h3>
        <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
        {/* Honest about email: only claim it was sent when Resend is
            actually configured server-side (see /api/bookings), never
            a blanket claim that could be false in this environment. */}
        <p className="mt-1 text-sm text-muted">
          {result.emailConfirmed ? t("emailConfirmationSent") : t("emailConfirmationPending")}
        </p>
      </div>

      <div className="rounded-xl border border-border p-4">
        <p className="text-xs text-muted">
          {t("bookingRef")}: <span className="font-mono">{bookingId}</span>
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          <Row label={t("pickup")} value={form.pickup} />
          <Row label={t("destination")} value={form.destination} />
          <Row label={t("dateTime")} value={`${form.date} ${form.time}`} />
          <Row label={t("passengers")} value={String(form.passengers)} />
          <Row label={t("luggage")} value={String(form.luggage)} />
          <Row
            label={t("vehicle")}
            value={
              form.vehicleType === "BUS" ? tb("vehicleBus") : tb("vehiclePersonenauto")
            }
          />
          {isAirport && form.flightNumber && (
            <Row label={t("flightNumber")} value={form.flightNumber} />
          )}
          {/* Real gap found in this audit: "Kinderzitje nodig" was saved
              to the database but never shown back anywhere afterwards —
              not here, not in either email (see email.ts's own fix) —
              so a customer had no confirmation their request actually
              registered. Reuses the same checkbox label (tb) the
              booking form itself already shows. */}
          {form.childSeat && (
            <Row label={tb("childSeatLabel")} value={locale === "nl" ? "Ja" : "Yes"} />
          )}
          <Row label={returnQuote ? tb("outboundTripLabel") : t("price")} value={`€${quote.totalPrice}`} strong={!returnQuote} />
        </dl>
      </div>

      {returnQuote && (
        <div className="rounded-xl border border-border p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {tb("returnTripSummaryLabel")}
          </p>
          <dl className="mt-3 space-y-2 text-sm">
            <Row label={t("pickup")} value={form.returnPickup || form.destination} />
            <Row label={t("destination")} value={form.returnDestination || form.pickup} />
            <Row label={t("dateTime")} value={`${form.returnDate} ${form.returnTime}`} />
            <Row label={t("price")} value={`€${returnQuote.totalPrice}`} />
          </dl>
        </div>
      )}

      {returnQuote && (
        <div className="flex items-center justify-between rounded-xl bg-brand/5 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">{tb("totalLabel")}</p>
          <p className="text-xl font-bold text-brand-text">€{totalPrice}</p>
        </div>
      )}

      <div className="rounded-xl bg-muted-background p-4">
        <p className="text-sm font-semibold text-foreground">{t("paymentTitle")}</p>
        <p className="mt-1 text-sm text-muted">
          {t("paymentBody")} {tp("receipt")}
        </p>
      </div>

      {isAirport && (
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
          <p className="text-sm font-semibold text-brand-text">{t("schipholTitle")}</p>
          <p className="mt-1 text-sm text-foreground/80">
            {getSchipholMeetingPointText(locale)}
          </p>
        </div>
      )}

      {/* Real gap found in this audit: the Schiphol text above
          explicitly says "bel of app dan het nummer dat u in uw
          boekingsbevestiging ontvangt" (call or message the number in
          your booking confirmation) — but no number ever actually
          appeared anywhere on this screen (or in the email, see
          email.ts's own fix). A stranded customer at Schiphol had
          nothing to call/app. "contactTitle" already existed as a
          translation key but was never wired to anything — this is
          that missing piece, shown for every booking (not just
          Schiphol ones: a private ride's driver is reached the same
          way). */}
      {companyInfo.whatsapp && (
        <div className="rounded-xl border border-border p-4">
          <p className="text-sm font-semibold text-foreground">{t("contactTitle")}</p>
          <TrackedLink
            event="whatsapp_clicked"
            href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(tb("whatsappPrefill"))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {tb("whatsappUs")}
          </TrackedLink>
        </div>
      )}

      <Link
        href="/"
        className="text-center text-sm font-medium text-brand-text hover:underline"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-semibold text-brand-text" : "text-foreground"}>{value}</dd>
    </div>
  );
}
