import { getTranslations, getLocale } from "next-intl/server";
import { GENERAL_FAQ } from "@/lib/faq";

/**
 * v9 rebuild — same accessible <details>/<summary> accordion as before
 * (no JS needed), restyled to the new tokens/radius. Content unchanged —
 * already covers every question the client's new spec lists.
 */
export async function FaqAccordion() {
  const t = await getTranslations("Faq");
  const locale = (await getLocale()) as "nl" | "en";
  const items = GENERAL_FAQ[locale];

  return (
    <section id="faq" className="bg-muted-background/50 py-14">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
        </div>
        <div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {items.map((item) => (
            <details key={item.q} className="group p-4 open:bg-muted-background/40">
              <summary className="cursor-pointer list-none rounded-lg py-2 font-medium text-foreground marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="shrink-0 text-lg leading-none text-brand transition group-open:rotate-45">+</span>
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
