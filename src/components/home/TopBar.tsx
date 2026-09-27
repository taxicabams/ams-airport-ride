import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

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
 */
export async function TopBar() {
  const t = await getTranslations("TopBar");

  return (
    <div className="hidden bg-ink-2 text-xs text-ink-foreground-muted md:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
            {t("available")}
          </span>
          <span>{t("freeCancellation")}</span>
        </div>
        {/* "Boeking opzoeken/wijzigen" is its own later phase (see the
            brief's own phasing) — no such page exists yet, so this
            points at Contact rather than a 404. */}
        <Link href="/contact" className="transition hover:text-white">
          {t("bookingLookup")}
        </Link>
      </div>
    </div>
  );
}
