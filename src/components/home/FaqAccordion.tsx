import { getTranslations, getLocale } from "next-intl/server";
import { GENERAL_FAQ } from "@/lib/faq";

/**
 * v10 rebuild — same accessible <details>/<summary> accordion (no JS
 * needed), now in two columns on desktop matching the client's mockup.
 * Content trimmed/reordered to the client's exact new 10-question list
 * (see lib/faq.ts) — a real question-set change, not just a restyle.
 */
export async function FaqAccordion() {
  const t = await getTranslations("Faq");
  const locale = (await getLocale()) as "nl" | "en";
  const items = GENERAL_FAQ[locale];

  return (
    <section id="faq" className="scroll-mt-24 bg-muted-background/50 py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-text">{t("eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-border bg-surface p-4 open:bg-muted-background/40"
            >
              <summary className="cursor-pointer list-none rounded-lg py-1 font-medium text-foreground marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="shrink-0 text-lg leading-none text-brand-text transition group-open:rotate-45">+</span>
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
