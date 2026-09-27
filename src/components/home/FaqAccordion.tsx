import { getTranslations, getLocale } from "next-intl/server";
import { GENERAL_FAQ } from "@/lib/faq";

/**
 * "Vertrekbord" rebuild — one bordered container with dividers (kept
 * from the previous pass; still matches "geen kaart per vraag"), second
 * question open by default per the brief's exact spec.
 */
export async function FaqAccordion() {
  const t = await getTranslations("Faq");
  const locale = (await getLocale()) as "nl" | "en";
  const items = GENERAL_FAQ[locale];

  return (
    <section id="faq" className="scroll-mt-24 bg-muted-background/60 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h2>
        </div>
        <div className="mt-10 divide-y divide-border overflow-hidden rounded-[18px] border border-border bg-surface">
          {items.map((item, i) => (
            <details key={item.q} className="group px-5 py-4 sm:px-7" open={i === 1}>
              <summary className="cursor-pointer list-none py-1 font-medium text-foreground marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="shrink-0 text-lg leading-none text-brand-text transition duration-200 group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-2 text-sm text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
