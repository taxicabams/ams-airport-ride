"use client";

import { useTranslations, useLocale } from "next-intl";
import { Field, inputClassName } from "@/components/ui/Field";
import { PickerField } from "@/components/ui/PickerField";
import { CalendarIcon, ClockIcon } from "@/components/ui/icons";
import { formatDateLong } from "@/lib/formatDate";
import type { BookingFormState } from "../types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+\s()-]{6,}$/;

export function ContactStep({
  form,
  onChange,
  onBack,
  onSubmit,
  submitting,
}: {
  form: BookingFormState;
  onChange: (patch: Partial<BookingFormState>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  const t = useTranslations("Booking");
  const locale = useLocale();
  const returnDateDisplay = formatDateLong(form.returnDate, locale);

  const nameValid = form.name.trim().length > 1;
  const phoneValid = PHONE_RE.test(form.phone.trim());
  const emailValid = EMAIL_RE.test(form.email.trim());
  const canSubmit = nameValid && phoneValid && emailValid && !submitting;

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
    >
      <Field label={t("nameLabel")} htmlFor="name">
        <input
          id="name"
          className={inputClassName}
          value={form.name}
          onChange={(e) => onChange({ name: e.target.value })}
          autoComplete="name"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label={t("phoneLabel")}
          htmlFor="phone"
          error={form.phone.length > 0 && !phoneValid ? t("invalidPhone") : undefined}
        >
          <input
            id="phone"
            type="tel"
            className={inputClassName}
            value={form.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            autoComplete="tel"
          />
        </Field>
        <Field
          label={t("emailLabel")}
          htmlFor="email"
          error={form.email.length > 0 && !emailValid ? t("invalidEmail") : undefined}
        >
          <input
            id="email"
            type="email"
            className={inputClassName}
            value={form.email}
            onChange={(e) => onChange({ email: e.target.value })}
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label={t("notesLabel")} htmlFor="notes">
        <textarea
          id="notes"
          rows={2}
          className={inputClassName}
          value={form.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-brand focus:ring-brand/40"
          checked={form.childSeat}
          onChange={(e) => onChange({ childSeat: e.target.checked })}
        />
        {t("childSeatLabel")}
      </label>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border text-brand focus:ring-brand/40"
          checked={form.returnTrip}
          onChange={(e) => onChange({ returnTrip: e.target.checked })}
        />
        {t("returnTripLabel")}
      </label>

      {form.returnTrip && (
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-border p-3 sm:grid-cols-2">
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
            step={900} // 15-minute increments, same as the outbound trip
            icon={<ClockIcon />}
          />
        </div>
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
          type="submit"
          disabled={!canSubmit}
          className="flex-1 rounded-full bg-accent px-5 py-3 text-base font-semibold text-accent-foreground shadow-sm transition enabled:hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? t("submitting") : t("submitButton")}
        </button>
      </div>
    </form>
  );
}
