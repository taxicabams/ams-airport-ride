import { getTranslations } from "next-intl/server";

/**
 * v9 rebuild — kept (the header/footer nav explicitly link here), but
 * as a single compact row of four numbered steps, not four separate
 * cards. The booking widget right above already demonstrates this flow
 * directly; this is just a one-glance confirmation, not a re-explanation.
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
    <section id="hoe-het-werkt" className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
        {t("eyebrow")}
      </h2>
      <ol className="mt-8 grid gap-6 sm:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="text-center">
            <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-foreground">
              {i + 1}
            </span>
            <p className="mt-2 text-sm font-semibold text-foreground">{step.title}</p>
            <p className="mt-1 text-xs text-muted">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
