import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * v9 rebuild — a plain typographic section, no photo/card, per the
 * client's own mockup for this exact spot. A clear, separate entry
 * point for non-Schiphol rides, honestly never calling the result a
 * "fixed price" (the distance/time formula applies here).
 */
export async function AmsterdamEntry() {
  const t = await getTranslations("AmsterdamTaxi");

  return (
    <section id="amsterdam-taxi" className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
      <p className="mt-3 text-muted">{t("body")}</p>

      <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-sm text-foreground/80">
        <li>{t("example1")}</li>
        <li>{t("example2")}</li>
        <li>{t("example3")}</li>
        <li>{t("example6")}</li>
      </ul>

      <p className="mt-5 text-sm text-muted">{t("outro")}</p>

      <Link
        href="/#boeken"
        className="mt-5 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark"
      >
        {t("cta")}
      </Link>
    </section>
  );
}
