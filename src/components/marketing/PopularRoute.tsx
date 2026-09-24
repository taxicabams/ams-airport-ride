import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * A single, prominent callout for the most-booked route (Amsterdam <->
 * Schiphol), right after the hero — visitors coming from Amsterdam get
 * an immediate sense of what a typical ride costs before scrolling any
 * further. "From €45" (not a flat claim) because Amsterdam addresses
 * vary by neighborhood (see staticRoutes.ts) — the existing calculator,
 * linked via the CTA, still determines the real price.
 */
export async function PopularRoute() {
  const t = await getTranslations("PopularRoute");

  return (
    <section className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-muted-background p-6 text-center sm:flex-row sm:justify-between sm:p-8 sm:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {t("title")}
          </p>
          <p className="mt-1 text-xl font-bold text-foreground">{t("route")}</p>
          <p className="mt-1 text-2xl font-bold text-brand">{t("price")}</p>
          <p className="mt-1 text-sm text-muted">{t("note")}</p>
        </div>
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <Link
            href="/#boeken"
            className="inline-block rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
          >
            {t("cta")}
          </Link>
          <p className="max-w-52 text-xs text-muted">{t("disclaimer")}</p>
        </div>
      </div>
    </section>
  );
}
