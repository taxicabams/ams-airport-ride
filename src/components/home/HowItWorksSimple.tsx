import { getTranslations } from "next-intl/server";

/**
 * "Vertrekbord" rebuild — 3 cards with large mono 01/02/03 numerals, per
 * the brief's exact spec; the third card ("Wij staan klaar") gets the
 * dark navy treatment it calls for. Copy says "bevestig je boeking," not
 * "bevestig & betaal" — payment stays after the ride (the client's own
 * confirmed decision this session), so the marketing copy never implies
 * online prepayment.
 */
export async function HowItWorksSimple() {
  const t = await getTranslations("HowItWorks");
  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
  ];

  return (
    <section id="hoe-het-werkt" className="scroll-mt-24 mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {t("eyebrow")}
        </h2>
        <p className="text-sm text-muted">{t("subtitle")}</p>
      </div>

      <ol className="mt-8 grid gap-5 sm:grid-cols-3">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li
              key={step.title}
              className={`rounded-[18px] border p-6 ${
                isLast ? "border-transparent bg-ink text-ink-foreground" : "border-border bg-surface"
              }`}
            >
              <span className={`font-mono text-3xl font-semibold ${isLast ? "text-brand" : "text-brand-text/50"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className={`mt-3 text-base font-semibold ${isLast ? "text-white" : "text-foreground"}`}>
                {step.title}
              </p>
              <p className={`mt-1 text-sm ${isLast ? "text-ink-foreground-muted" : "text-muted"}`}>{step.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
