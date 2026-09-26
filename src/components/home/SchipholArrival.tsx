import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSchipholMeetingPointText } from "@/lib/schipholMeetingPoint";

/**
 * v9 rebuild — a plain numbered list, no photo/card treatment, matching
 * the client's own compact mockup for this section exactly. Flight-delay
 * reassurance folds in as one line at the bottom (already merged out of
 * its own section in an earlier pass) — still the same honest copy, no
 * automated-tracking claim that isn't real. No invented hall/door — see
 * lib/schipholMeetingPoint.ts's `verified: false` note.
 */
export async function SchipholArrival() {
  const t = await getTranslations("Schiphol");
  const ts = await getTranslations("SchipholSteps");
  const tf = await getTranslations("FlightDelay");
  const locale = (await getLocale()) as "nl" | "en";
  const steps = [ts("step1"), ts("step2"), ts("step3"), ts("step4"), ts("step5")];

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{ts("title")}</h2>
      </div>

      <ol className="mx-auto mt-8 flex max-w-md flex-col gap-3">
        {steps.map((step, i) => (
          <li key={step} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
              {i + 1}
            </span>
            <p className="text-sm font-medium text-foreground">{step}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-6 max-w-md rounded-xl border border-border bg-muted-background/50 p-4 text-sm text-foreground/80">
        <p>{getSchipholMeetingPointText(locale)}</p>
        <p className="mt-2">
          <span className="font-semibold text-foreground">{tf("title")} {tf("highlight")}</span> {tf("note")}
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/veelgestelde-vragen" className="text-sm font-semibold text-brand hover:underline">
          {t("moreLink")}
        </Link>
      </div>
    </section>
  );
}
