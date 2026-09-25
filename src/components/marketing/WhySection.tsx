import { getTranslations } from "next-intl/server";

/**
 * New section per the design-system brief v2 — didn't exist before. Three
 * plain, numbered cards, no imagery needed (the brief is explicit about
 * that): clear pricing, simple booking, and the honest scope statement
 * ("we focus on Schiphol + Amsterdam-area rides") rather than an
 * inflated "we go everywhere" claim.
 */
export async function WhySection() {
  const t = await getTranslations("Why");
  const items = [
    { title: t("item1Title"), body: t("item1Body") },
    { title: t("item2Title"), body: t("item2Body") },
    { title: t("item3Title"), body: t("item3Body") },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
        <p className="mt-3 text-muted">{t("intro")}</p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {items.map((item, i) => (
          <div key={item.title} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
            <span className="text-sm font-bold text-brand/50">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-2 text-lg font-semibold text-foreground">{item.title}</p>
            <p className="mt-2 text-sm text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
