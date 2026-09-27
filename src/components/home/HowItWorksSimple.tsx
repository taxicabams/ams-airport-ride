import { getTranslations } from "next-intl/server";

/**
 * Layout 4.0 — light polish pass: bigger "01/02/03/04" numerals (per the
 * brief's own example format) instead of small filled digit-circles, more
 * generous spacing. Still one compact row of four steps on desktop,
 * stacking vertically on mobile — the booking widget right above already
 * demonstrates the flow directly, so this stays a one-glance summary,
 * not a re-explanation.
 */
export async function HowItWorksSimple() {
  const t = await getTranslations("HowItWorks");
  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
    { title: t("step4Title"), body: t("step4Body") },
  ];

  return (
    <section id="hoe-het-werkt" className="scroll-mt-24 mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {t("eyebrow")}
      </h2>
      <ol className="mt-10 grid gap-8 sm:grid-cols-4 sm:gap-6">
        {steps.map((step, i) => (
          <li key={step.title} className="text-center sm:text-left">
            <span className="text-2xl font-bold text-brand-text/40">
              {String(i + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-base font-semibold text-foreground">{step.title}</p>
            <p className="mt-1 text-sm text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
