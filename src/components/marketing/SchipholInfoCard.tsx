import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getSchipholMeetingPointText } from "@/lib/schipholMeetingPoint";
import { schipholArrivalPhoto } from "@/lib/schipholArrivalPhoto";

/**
 * Restructured into the brief's two-column layout (real, license-verified
 * Schiphol photo left — see schipholArrivalPhoto.ts — copy + numbered
 * steps right). The fuller meeting-point prose (unchanged, shared with
 * the confirmation screen and booking email) stays beneath the steps.
 * Neither version invents a specific hall/door — see
 * lib/schipholMeetingPoint.ts's `verified: false` note on why. The
 * flight-delay reassurance now lives in its own FlightDelay section.
 */
export async function SchipholInfoCard() {
  const t = await getTranslations("Schiphol");
  const ts = await getTranslations("SchipholSteps");
  const locale = (await getLocale()) as "nl" | "en";
  const steps = [ts("step1"), ts("step2"), ts("step3"), ts("step4"), ts("step5")];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border shadow-elevated">
          <Image
            src={schipholArrivalPhoto.url}
            alt={schipholArrivalPhoto.alt[locale]}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
          <p className="mt-3 text-muted">{t("intro")}</p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-2">
            {steps.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
                  {i + 1}
                </span>
                <p className="pt-0.5 text-sm font-medium text-foreground">{step}</p>
              </li>
            ))}
          </ol>

          <Link
            href="/veelgestelde-vragen"
            className="mt-5 inline-block text-sm font-semibold text-brand hover:underline"
          >
            {t("moreLink")}
          </Link>

          <p className="mt-5 max-w-xl border-t border-border pt-5 text-sm text-foreground/80">
            {getSchipholMeetingPointText(locale)}
          </p>
        </div>
      </div>
    </section>
  );
}
