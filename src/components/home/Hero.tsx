import { getTranslations } from "next-intl/server";
import { CheckIcon } from "@/components/ui/icons";
import { BookingWidget } from "@/components/booking/BookingWidget";

/**
 * "Vertrekbord" hero — two-column spec: left column is the pitch
 * (labels, heading, subtext, trust checkmarks), right column is the
 * actual booking card (BookingWidget rendered directly, not floated
 * below on a separate row like the previous Layout 4.0 hero).
 * BookingWidget's own internals are untouched — only where it's placed
 * changed.
 *
 * Per explicit client feedback this pass: the Google-review-score line,
 * the ILT/KvK line and the payment-logo line are all removed — none of
 * them were wanted (Google reviews are being replaced by the site's own
 * database-backed reviews — see Reviews.tsx — and ILT/KvK/iDEAL were
 * simply "hoef ik niet").
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
