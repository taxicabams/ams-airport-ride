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
        <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-background">
          {items.map((item) => (
            <details key={item.q} className="group p-4">
              <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-muted transition group-open:rotate-45">+</span>
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
