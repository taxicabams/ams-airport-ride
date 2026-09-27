import { getTranslations } from "next-intl/server";
import { StarIcon } from "@/components/ui/icons";
import { companyInfo } from "@/lib/companyInfo";

/**
 * Reviews section — deliberately NOT filled with invented star ratings,
 * review counts, customer names or quotes. This is a hard line carried
 * through this entire project ("verzin niets... nooit reviews of
 * klantaantallen verzinnen"), and it doesn't bend even for a
 * not-to-be-deployed preview: fabricated testimonial text is fabricated
 * regardless of whether it ships. Where companyInfo.googleReviewsUrl/
 * Score/Count are still null (as they are today), this renders the
 * section's real structure with the brief's own bracket-placeholder
 * convention ("[Google-score]", "[Naam]", "[Review-tekst volgt...]") —
 * exactly what the client's own brief asked for missing content — so
 * the layout is visible without asserting anything false. The moment
 * real values are supplied, swap them in here; no fake numbers ever sat
 * in this file waiting to accidentally go live.
 */
export async function Reviews() {
  const t = await getTranslations("Reviews");
  const hasRealScore = Boolean(companyInfo.googleReviewScore && companyInfo.googleReviewCount);

  return (
    <section id="reviews" className="scroll-mt-24 mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text">{t("eyebrow")}</p>
        <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 flex items-center justify-center gap-2 font-mono text-sm text-muted">
          <span className="flex items-center gap-0.5 text-brand">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className="h-4 w-4" />
            ))}
          </span>
          {hasRealScore
            ? `${companyInfo.googleReviewScore} · ${companyInfo.googleReviewCount} reviews`
            : t("scoreLine")}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[18px] border border-border bg-surface p-5">
            <p className="text-sm text-muted">{t("placeholderQuote")}</p>
            <p className="mt-3 text-sm font-semibold text-foreground">{t("placeholderName")}</p>
          </div>
        ))}
      </div>

      {companyInfo.googleReviewsUrl ? (
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href={companyInfo.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[10px] bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition duration-150 hover:bg-brand-dark"
          >
            {t("cta")}
          </a>
          <a
            href={companyInfo.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[10px] border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition duration-150 hover:bg-muted-background"
          >
            {t("writeReview")}
          </a>
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-muted">{t("empty")}</p>
      )}
    </section>
  );
}
