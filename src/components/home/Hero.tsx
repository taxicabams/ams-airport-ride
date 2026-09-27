import { getTranslations } from "next-intl/server";
import { CheckIcon, ShieldCheckIcon, StarIcon } from "@/components/ui/icons";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { companyInfo } from "@/lib/companyInfo";

/**
 * "Vertrekbord" hero — full rebuild per the brief's two-column spec:
 * left column is the pitch (labels, heading, subtext, trust lines),
 * right column is the actual booking card (BookingWidget rendered
 * directly, not floated below on a separate row like the previous
 * Layout 4.0 hero). BookingWidget's own internals are untouched — only
 * where it's placed changed.
 *
 * The Google review score/count still show a bracket placeholder
 * ("[Google-score] · [aantal] reviews") rather than an invented number —
 * companyInfo.googleReviewScore/Count are deliberately still null (no
 * real profile exists yet), unlike kvkNumber/licenseNumber, which the
 * client explicitly asked to fill with an obvious "1234567"-style
 * preview value and so are shown for real here.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const trustItems = t("compactTrustLine").split(" · ");

  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
        <div>
          <div className="flex flex-wrap gap-2">
            {[t("label1"), t("label2"), t("label3")].map((label) => (
              <span
                key={label}
                className="rounded-[10px] border border-brand/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-brand"
              >
                {label}
              </span>
            ))}
          </div>

          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            {t("title")} <span className="text-brand">{t("titleHighlight")}</span>
          </h1>

          <p className="mt-4 max-w-lg text-ink-foreground-muted">{t("subtitle")}</p>

          <div className="mt-6 space-y-2.5 text-sm">
            <p className="flex items-center gap-2 text-ink-foreground-muted">
              <span className="flex items-center gap-0.5 text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className="h-3 w-3" />
                ))}
              </span>
              {t("trustReviews")}
            </p>
            <p className="flex items-center gap-2 text-ink-foreground-muted">
              <ShieldCheckIcon className="h-4 w-4 shrink-0 text-success" />
              {companyInfo.kvkNumber
                ? t("trustLicenseReal", { kvk: companyInfo.kvkNumber })
                : t("trustLicense")}
            </p>
            <p className="font-mono text-xs text-ink-foreground-muted">{t("trustPayment")}</p>
          </div>
        </div>

        <div id="boeken" className="scroll-mt-24">
          <BookingWidget />
          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-medium text-ink-foreground-muted">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
