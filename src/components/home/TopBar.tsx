import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";

/**
 * "Vertrekbord" identity — near-black utility bar above the main header,
 * per the brief's exact spec: a green "24/7" dot, the direct-carrier
 * differentiator, and a free-cancellation line (hours left as "[X]" —
 * companyInfo has no real policy value yet, so this stays an honest
 * bracket placeholder rather than an invented number) on the left;
 * booking lookup, business account and the locale switch on the right.
 * Hidden on mobile (the brief's own mobile spec doesn't include it) to
 * keep the small screen focused on the hero.
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
          <span>{t("directCarrier")}</span>
          <span>{t("freeCancellation")}</span>
        </div>
        <div className="flex items-center gap-5">
          {/* "Boeking opzoeken/wijzigen" is its own later phase (see the
              brief's own phasing) — no such page exists yet, so this
              points at Contact rather than a 404. */}
          <Link href="/contact" className="transition hover:text-white">
            {t("bookingLookup")}
          </Link>
          <Link href="/#zakelijk" className="transition hover:text-white">
            {t("businessAccount")}
          </Link>
          <LocaleSwitcher />
        </div>
      </div>
    </div>
  );
}
