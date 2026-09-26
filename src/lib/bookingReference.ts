/**
 * A short, human-friendly booking reference — e.g. "AMS-260926-4821" —
 * shown to the customer instead of the raw database id (a long cuid
 * like "clh3k2j9x0000qzrm..."), which is fine as a primary key but
 * useless for a customer to read aloud over the phone or WhatsApp.
 *
 * Deliberately *derived*, not stored: a deterministic function of the
 * booking's own id + createdAt, computed wherever it's displayed
 * (API response, confirmation screen, both emails). No new database
 * column, no migration against the live production database — the
 * same booking always produces the same reference, calculated fresh
 * every time. Good enough for the site's current volume; if daily
 * booking volume ever gets high enough that the 1-in-10000 same-day
 * collision odds become a real concern, upgrade to a real sequential
 * column with a migration then — not needed yet.
 */
export function bookingReference(booking: { id: string; createdAt: Date }): string {
  const dd = String(booking.createdAt.getDate()).padStart(2, "0");
  const mm = String(booking.createdAt.getMonth() + 1).padStart(2, "0");
  const yy = String(booking.createdAt.getFullYear()).slice(-2);

  // A simple, stable string hash of the id — same id always produces
  // the same 4-digit suffix, so the reference never changes for a
  // given booking even though nothing is persisted.
  let hash = 0;
  for (const char of booking.id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  const suffix = String(hash % 10000).padStart(4, "0");

  return `AMS-${dd}${mm}${yy}-${suffix}`;
}
