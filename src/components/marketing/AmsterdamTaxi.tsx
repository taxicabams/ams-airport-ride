import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Makes explicit what the pricing engine and homepage FAQ already know
 * but the hero (Schiphol-first, by design) doesn't say out loud: this
 * isn't an airport-only service. Links straight into the existing
 * booking calculator (#boeken, same anchor the header's CTA uses) —
 * "Bereken je ritprijs" isn't a second calculator, just a way in.
 */
export async function AmsterdamTaxi() {
  const t = await getTranslations("AmsterdamTaxi");

  return (
    <section id="amsterdam-taxi" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-border bg-muted-background p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
        <p className="mt-3 max-w-2xl text-foreground/90">{t("body")}</p>
        <Link
          href="/#boeken"
          className="mt-5 inline-block rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
