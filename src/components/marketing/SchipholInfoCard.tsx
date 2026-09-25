import { getTranslations, getLocale } from "next-intl/server";
import { getSchipholMeetingPointText } from "@/lib/schipholMeetingPoint";
import { ClockIcon } from "@/components/ui/icons";

/**
 * The client's requirement: Schiphol pickup instructions must be
 * prominent on the homepage, not buried only in the FAQ (see the plan —
 * this is exactly the gap Taxi Falcon had). The numbered steps give a
 * quick, scannable overview; the fuller prose underneath (unchanged,
 * from the one shared config also used on the confirmation screen and
 * in the booking email) keeps the details a skim misses — the free wifi
 * network name, and what to do if the driver isn't immediately visible.
 * Neither version invents a specific hall/door — see
 * lib/schipholMeetingPoint.ts's `verified: false` note on why.
 */
export async function SchipholInfoCard() {
  const t = await getTranslations("Schiphol");
  const ts = await getTranslations("SchipholSteps");
  const locale = (await getLocale()) as "nl" | "en";
  const steps = [ts("step1"), ts("step2"), ts("step3"), ts("step4"), ts("step5")];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-brand">{t("title")}</h2>

        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <li key={step} className="flex items-start gap-3 sm:flex-col sm:items-start sm:gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm font-medium text-foreground sm:pt-0">{step}</p>
            </li>
          ))}
        </ol>

        <p className="mt-6 max-w-3xl border-t border-brand/10 pt-5 text-sm text-foreground/80">
          {getSchipholMeetingPointText(locale)}
        </p>

        {/* A small, distinct card for the flight-delay reassurance (the
            brief's own "Flight delayed? No problem." callout) rather than
            a plain trailing paragraph — copy stays the honest, already-
            corrected wording ("we'll take it into account", not "we
            monitor automatically"). */}
        <div className="mt-5 flex max-w-3xl items-start gap-3 rounded-xl border border-border bg-background p-4 shadow-card">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <ClockIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-foreground">{t("delayTitle")}</p>
            <p className="mt-0.5 text-sm text-muted">{t("note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
