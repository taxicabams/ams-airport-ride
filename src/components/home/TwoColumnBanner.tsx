import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { amsterdamPhoto } from "@/lib/amsterdamPhoto";
import { schipholArrivalPhoto } from "@/lib/schipholArrivalPhoto";

/**
 * v10 rebuild — replaces v9's two separate plain-text sections
 * (AmsterdamEntry, SchipholArrival) with the client's new mockup: two
 * real photo banner cards side by side, each compact (one heading, one
 * short paragraph). Both photos are real, Unsplash-licensed stock
 * already vetted and in production elsewhere (see amsterdamPhoto.ts /
 * schipholArrivalPhoto.ts) — reused here, not new/fabricated images.
 *
 * The detailed Schiphol arrival steps + meeting-point/flight-delay copy
 * that used to live in SchipholArrival.tsx haven't been deleted — they
 * already exist as real FAQ answers (see lib/faq.ts's "Hoe vind ik mijn
 * chauffeur op Schiphol?" / "Wat als mijn vlucht vertraging heeft?"),
 * which this card's link points straight to. Nothing lost, just no
 * longer duplicated on the homepage itself.
 *
 * Never states a fixed price for the Amsterdam (non-Schiphol) card —
 * that section's whole point is the honest distance/time-based formula.
 */
export async function TwoColumnBanner() {
  const t = await getTranslations("TwoColumnBanner");

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl bg-ink p-6">
          <Image
            src={amsterdamPhoto.url}
            alt={amsterdamPhoto.alt.nl}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-60"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
          <div className="relative">
            <h3 className="text-lg font-bold text-white">{t("amsterdamTitle")}</h3>
            <p className="mt-1.5 text-sm text-white/80">{t("amsterdamBody")}</p>
            <Link
              href="/#boeken"
              className="mt-4 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark"
            >
              {t("amsterdamCta")}
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-2xl bg-ink p-6">
          <Image
            src={schipholArrivalPhoto.url}
            alt={schipholArrivalPhoto.alt.nl}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-50"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
          <div className="relative">
            <h3 className="text-lg font-bold text-white">{t("schipholTitle")}</h3>
            <p className="mt-1.5 text-sm text-white/80">{t("schipholBody")}</p>
            <Link
              href="/veelgestelde-vragen"
              // This card's background is always the dark --ink navy
              // (unlike most of the page, which follows the site theme)
              // — text-brand (gold, good contrast on dark in both
              // themes) is correct here, not text-brand-text (which is
              // navy in light mode and would nearly disappear on this
              // always-dark card).
              className="mt-4 inline-block text-sm font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
            >
              {t("schipholLink")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
