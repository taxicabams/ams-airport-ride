import { getTranslations } from "next-intl/server";

export async function HowItWorks() {
  const t = await getTranslations("HowItWorks");
  const steps = [
    { title: t("step1Title"), body: t("step1Body") },
    { title: t("step2Title"), body: t("step2Body") },
    { title: t("step3Title"), body: t("step3Body") },
    { title: t("step4Title"), body: t("step4Body") },
  ];

  return (
    <section className="bg-muted-background py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
        <ol className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* A single connecting line behind the numbered steps — pure
              CSS, no new asset — ties the 4 cards together as one
              sequence instead of 4 unrelated boxes. Desktop only: on a
              2-column mobile grid the line would cut across unrelated
              steps. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-9 hidden h-px bg-border lg:block"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-xl bg-background p-5 shadow-card">
              <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-base font-bold text-accent-foreground ring-4 ring-background">
                {i + 1}
              </span>
              <p className="mt-3 font-semibold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
