import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CheckIcon } from "@/components/ui/icons";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";
import { finalCtaPhoto } from "@/lib/finalCtaPhoto";

/**
 * v10 rebuild — a genuine full-width photo hero, replacing v9's
 * deliberately photo-less "booking widget IS the hero" approach, per the
 * client's new explicit mockup: a large background image with a dark
 * navy overlay, headline/price/CTA in the lower-left, and the booking
 * card (rendered by the caller, see HeroBooking.tsx) overlapping this
 * section's bottom edge on desktop.
 *
 * Photo: reuses finalCtaPhoto (a real, Unsplash-licensed shot of an
 * aircraft at dusk at Schiphol — already vetted and in production for
 * the final CTA band) rather than inventing a new "premium taxi at
 * Schiphol" image. No generic vehicle photo exists in this repo yet and
 * sourcing one wasn't in scope this pass — swapping in a dedicated hero
 * photo later is a one-line change here (see the client's own brief:
 * "bouw de component zo dat er eenvoudig één echte foto geplaatst kan
 * worden"). The warm dusk tone already reads well against the new
 * navy+gold palette.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  // Reuses the existing single "item1 · item2 · item3" trust-line
  // string (already written, already correct in both languages)
  // instead of introducing three new translation keys for the same
  // content, just presented as separate icon+label chips here.
  const trustItems = t("compactTrustLine").split(" · ");

  return (
    <section className="relative isolate overflow-hidden bg-ink pb-24 pt-10 sm:pb-40 sm:pt-14 md:pb-52">
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
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {t("title")}
        </h1>
        {/* This section's backdrop is always the dark photo+ink overlay,
            independent of the site's light/dark theme — text-brand
            (gold, good contrast on dark either way) is correct here,
            not text-brand-text (navy in light mode, which would nearly
            disappear on this always-dark hero). */}
        <p className="mt-3 text-2xl font-bold text-brand sm:text-3xl">
          {t("heroPrice", { price: CHEAPEST_SCHIPHOL_PRICE })}
        </p>
        <p className="mt-3 text-base text-white/80 sm:text-lg">{t("subtitle")}</p>

        <Link
          href="/#boeken"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark"
        >
          {t("ctaPrimary")}
        </Link>

        <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/80">
          {trustItems.map((item) => (
            <li key={item} className="flex items-center gap-1.5">
              <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
