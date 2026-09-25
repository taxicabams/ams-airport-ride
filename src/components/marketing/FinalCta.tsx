import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { finalCtaPhoto } from "@/lib/finalCtaPhoto";

/**
 * New closing section per the brief: a full-width real Schiphol photo
 * (license-verified, see finalCtaPhoto.ts) with a dark overlay applied in
 * CSS (not baked into the image itself) so the centered text stays
 * legible without the photo needing to be edited. Deliberately calm —
 * one photo, one message, one button, not a busy composition.
 */
export async function FinalCta() {
  const t = await getTranslations("FinalCta");
  const locale = (await getLocale()) as "nl" | "en";

  return (
    <section className="relative overflow-hidden py-20">
      <Image
        src={finalCtaPhoto.url}
        alt={finalCtaPhoto.alt[locale]}
        fill
        loading="lazy"
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-ink/75" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-light">
          {t("eyebrow")}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{t("title")}</h2>
        <p className="mt-3 text-white/80">{t("body")}</p>
        <Link
          href="/#boeken"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition hover:brightness-110"
        >
          {t("cta")}
        </Link>
        <p className="mt-3 text-sm text-white/60">{t("note")}</p>
      </div>
    </section>
  );
}
