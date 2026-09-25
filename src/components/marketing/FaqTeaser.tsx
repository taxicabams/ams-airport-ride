import { getTranslations, getLocale } from "next-intl/server";
import { GENERAL_FAQ } from "@/lib/faq";

/**
 * <details>/<summary> gives a fully accessible, keyboard-friendly
 * accordion with zero JavaScript — no need for a client component or a
 * UI library here.
 */
export async function FaqTeaser() {
  const t = await getTranslations("Faq");
  const locale = (await getLocale()) as "nl" | "en";
  const items = GENERAL_FAQ[locale];

  return (
    <section className="bg-muted-background py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface shadow-card">
          {items.map((item) => (
            <details key={item.q} className="group p-4 open:bg-muted-background/60">
              {/* py-2: see the note in veelgestelde-vragen/page.tsx —
                  the parent's padding isn't part of <summary>'s own
                  tap target. */}
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
