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
 *
 * Layout 4.0 — given a section id ("amsterdam-taxi") for the first time:
 * both the header nav and footer already linked to "/#amsterdam-taxi",
 * a real, live, pre-existing dead anchor (the id never existed anywhere
 * in the DOM), found and fixed in this pass. Cards themselves enlarged
 * (taller, bigger heading, more padding) to read as two real sections
 * rather than two small banners.
 */
export async function TwoColumnBanner() {
  const t = await getTranslations("TwoColumnBanner");

  return (
    <section id="amsterdam-taxi" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl bg-ink p-7 sm:p-8">
          <Image
            src={amsterdamPhoto.url}
            alt={amsterdamPhoto.alt.nl}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-60"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white">{t("amsterdamTitle")}</h3>
            <p className="mt-2 max-w-sm text-white/80">{t("amsterdamBody")}</p>
            <Link
              href="/#boeken"
              className="mt-5 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground shadow-sm transition duration-150 hover:bg-brand-dark"
            >
              {t("amsterdamCta")}
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-2xl bg-ink p-7 sm:p-8">
          <Image
            src={schipholArrivalPhoto.url}
            alt={schipholArrivalPhoto.alt.nl}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover opacity-50"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-transparent" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-white">{t("schipholTitle")}</h3>
            <p className="mt-2 max-w-sm text-white/80">{t("schipholBody")}</p>
            <Link
              href="/veelgestelde-vragen"
              // This card's background is always the dark --ink navy
              // (unlike most of the page, which follows the site theme)
              // — text-brand (gold, good contrast on dark in both
              // themes) is correct here, not text-brand-text (which is
              // navy in light mode and would nearly disappear on this
              // always-dark card).
              className="mt-5 inline-block text-sm font-semibold text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand"
            >
              {t("schipholLink")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
