import { getTranslations } from "next-intl/server";

/**
 * Departure-board-style example bar under the hero. Per the explicit
 * decision this session, this is illustrative only — labelled "example"
 * and with a visible disclaimer — not a real, working flight-tracking
 * integration (that was explicitly declined: no flight-data API, no
 * automatic pickup-time adjustment is actually implemented). Only the
 * flight number field + manual human follow-up (already real, already
 * on the booking form) exists today.
 */
export async function FlightMonitorBar() {
  const t = await getTranslations("FlightMonitor");

  return (
    <div className="border-t border-white/5 bg-ink-3 py-3">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-1.5 text-[11px] uppercase tracking-wider text-ink-foreground-muted">{t("label")}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs sm:text-sm">
          <span className="font-semibold text-white">{t("flightCode")}</span>
          <span className="text-ink-foreground-muted">|</span>
          <span className="text-ink-foreground-muted">{t("landingExpected")}</span>
          <span className="text-ink-foreground-muted">|</span>
          <span className="text-warning">{t("delay")}</span>
          <span className="text-ink-foreground-muted">|</span>
          <span className="text-success">{t("adjusted")}</span>
        </div>
        <p className="mt-1.5 text-[11px] text-ink-foreground-muted/80">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
