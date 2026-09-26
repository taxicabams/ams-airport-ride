import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * v9 rebuild — one message, one button, per the client's exact spec:
 * "Geen enorme marketingverhandeling." Dark --ink band (same deliberate
 * dark accent used by the footer) instead of a photo, keeping the whole
 * page's typographic/functional language consistent to the very end.
 */
export async function FinalCta() {
  const t = await getTranslations("FinalCtaSimple");

  return (
    <section className="bg-ink py-16 text-center text-ink-foreground">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">{t("title")}</h2>
        <p className="mt-2 text-white/70">{t("body")}</p>
        <Link
          href="/#boeken"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition hover:brightness-110"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
