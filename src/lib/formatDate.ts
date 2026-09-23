/**
 * Full, unambiguous date display ("29 september 2026") for every
 * date PickerField in the app (outbound trip, return trip, ...) — one
 * shared implementation so they can never format differently or drift
 * out of sync on the crash-safety guard below.
 *
 * A native date input can (rarely, mid-edit via keyboard segment
 * navigation) hold a value that `new Date(...)` turns into an
 * out-of-range/Invalid Date — formatting that used to throw a
 * RangeError and crash the step it was in. Returns "" instead of ever
 * throwing.
 */
export function formatDateLong(dateValue: string, locale: string): string {
  if (!dateValue) return "";
  const parsed = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" }).format(
    parsed
  );
}
