import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Mobile-only bottom bar keeping the primary CTA reachable while
 * scrolling (the brief's explicit "sticky mobile CTA" requirement) —
 * desktop already has the header's own "Book now" button always in
 * view, so this is `md:hidden`. `pb-[env(safe-area-inset-bottom)]`
 * keeps it clear of the home-indicator area on notched phones; the
 * layout adds matching bottom padding to <main> so this bar never
 * covers the last bit of page content (see layout.tsx).
 */
export async function StickyMobileCta() {
  const t = await getTranslations("StickyCta");

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <p className="text-sm font-semibold text-foreground">{t("label")}</p>
        <Link
          href="/#boeken"
          className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
