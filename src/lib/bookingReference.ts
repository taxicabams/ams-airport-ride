/**
 * A short, human-friendly booking reference — e.g. "AMS-4821" — shown to
 * the customer instead of the raw database id (a long cuid like
 * "clh3k2j9x0000qzrm..."), which is fine as a primary key but useless
 * for a customer to read aloud over the phone or WhatsApp.
 *
 * Shortened this pass per direct feedback ("bookingsnummer moet
 * korter") — dropped the DDMMYY date segment (already shown separately
 * as the actual ride date everywhere this reference appears) and kept
 * only a short numeric suffix.
 *
 * Deliberately *derived*, not stored: a deterministic function of the
 * booking's own id, computed wherever it's displayed (API response,
 * confirmation screen, both emails). No new database column, no
 * migration against the live production database — the same booking
 * always produces the same reference, calculated fresh every time.
 * Good enough for the site's current volume; if daily booking volume
 * ever gets high enough that the 1-in-10000 collision odds become a
 * real concern, upgrade to a real sequential column with a migration
 * then — not needed yet.
 */
export function bookingReference(booking: { id: string; createdAt: Date }): string {
  // A simple, stable string hash of the id — same id always produces
  // the same 4-digit suffix, so the reference never changes for a
  // given booking even though nothing is persisted. createdAt is no
  // longer part of the reference itself, but stays a required param so
  // every existing call site (API route, both emails, confirmation
  // screen) keeps working unchanged.
  let hash = 0;
  for (const char of booking.id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  const suffix = String(hash % 10000).padStart(4, "0");

  return `AMS-${suffix}`;
}
