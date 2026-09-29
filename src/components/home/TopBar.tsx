import { getTranslations } from "next-intl/server";

/**
 * "Vertrekbord" identity — near-black utility bar above the main header.
 * Per explicit client feedback this pass: the "direct bij de vervoerder"
 * differentiator line is removed ("hoeft ook niet"), the free-
 * cancellation line now states the real, confirmed policy (3 hours)
 * instead of a "[X]" bracket placeholder, and "Zakelijk account" is
 * removed from here entirely — the whole business/invoice section was
 * later removed site-wide too ("die zakelijk en op rekening hoef ik ook
 * niet"). The locale switcher moved to Header (always visible, not just
 * desktop) — see LocaleSwitcher.tsx's own note.
 *
 * Two real, live issues found and fixed together in a later audit:
 * 1. "Boeking opzoeken" (find your booking) linked to /contact, which
 *    doesn't let anyone look anything up — a button that doesn't do
 *    what its own text says. A real self-service lookup (booking
 *    reference + email/phone match) is fully speced out and ready to
 *    build, but needs a database migration this session can't apply
 *    itself (blocked pending the client's own explicit action/
 *    permission — see the final report). Removed the link entirely for
 *    now rather than leave a misleading one live.
 * 2. The availability line said "24/7 bereikbaar" (reachable 24/7) right
 *    next to companyInfo.ts's phone/WhatsApp, which are both null until
 *    the client supplies real numbers — with zero live contact channel,
 *    a "reachable" claim is actively false today. Changed to "boekbaar"
 *    (bookable) — true regardless of contact-channel status, since the
 *    booking form itself has no opening hours. Revert to "bereikbaar"
 *    once real 24/7 phone/WhatsApp support is confirmed and live.
 */
export async function TopBar() {
  const t = await getTranslations("TopBar");

  return (
    <div className="hidden bg-ink-2 text-xs text-ink-foreground-muted md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-5 px-4 py-2 sm:px-6">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
          {t("available")}
        </span>
        <span>{t("freeCancellation")}</span>
      </div>
    </div>
  );
}
