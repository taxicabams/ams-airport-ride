import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { finalCtaPhoto } from "@/lib/finalCtaPhoto";

/**
 * v12 — made much more compact per the client's explicit "the booking
 * must appear almost immediately" note. Previously this section also
 * carried a separate price line, a CTA button, and a trust-checkmark
 * row — all real content, but all now redundant real estate sitting
 * *between* the headline and the booking widget: TrustBar (right below
 * the booking card) already shows the same claims, and the booking
 * widget's own "Volgende" button already is the call to action. Removed
 * here, not lost — this is deduplication, not a content cut. Just
 * eyebrow → title → one subtitle line, then straight into the booking
 * card (rendered by the caller, see HeroBooking.tsx), which now needs
 * far less padding underneath to make room for the overlap.
 */
export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative isolate overflow-hidden bg-ink pb-10 pt-8 sm:pb-14 sm:pt-10">
      <Image
        src={finalCtaPhoto.url}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_60%] opacity-90"
      />
      {/* Bottom-heavy navy scrim: nearly opaque where the text/booking
          card sit, fading out toward the top so the photo still reads. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-2 text-base text-white/80 sm:text-lg">{t("subtitle")}</p>
      </div>
    </section>
  );
}
