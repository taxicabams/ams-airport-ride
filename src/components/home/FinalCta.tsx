import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { finalCtaPhoto } from "@/lib/finalCtaPhoto";

/**
 * Layout 4.0 — a real full-width photo section (finalCtaPhoto, already
 * real/license-clean and in production elsewhere on this site) with a
 * dark overlay, replacing the flat --ink color band, per the brief's
 * "één sterke full-width image section... Achtergrond: Schiphol /
 * airport / taxi." Still exactly one message, one button — no extra
 * CTAs, per the client's own repeated "geen enorme marketingverhandeling."
 */
export async function FinalCta() {
  const t = await getTranslations("FinalCtaSimple");

  return (
    <section className="relative isolate overflow-hidden bg-ink py-20 text-center text-ink-foreground sm:py-28">
      <Image
        src={finalCtaPhoto.url}
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-50"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/60"
      />
      <div className="relative mx-auto max-w-xl px-4 sm:px-6">
        <h2 className="text-3xl font-bold sm:text-4xl">{t("title")}</h2>
        <p className="mt-3 text-white/70">{t("body")}</p>
        <Link
          href="/#boeken"
          className="mt-7 inline-block rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition duration-150 hover:brightness-110"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
