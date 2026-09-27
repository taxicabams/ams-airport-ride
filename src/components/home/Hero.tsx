import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CheckIcon } from "@/components/ui/icons";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";
import { heroPhoto } from "@/lib/heroPhoto";

/**
 * Layout 4.0 — deliberately much taller than v13's compact hero (roughly
 * 640-680px tall on desktop vs. ~300px before), per the client's explicit
 * new brief: "Dit moet het sterkste gedeelte van de website worden,"
 * 600-700px on desktop. This supersedes the earlier "keep it short so
 * the booking box appears immediately" note from a previous round — a
 * later, more specific instruction from the same client, not a
 * regression. Content (eyebrow/title/price/subtitle/CTA/trust row) is
 * unchanged from v13, just given real room to breathe and set in a much
 * bigger, more confident type scale. The header now starts transparent
 * over this photo (see Header.tsx) instead of a permanently solid bar —
 * Hero pulls itself up by roughly the header's own height (-mt-16, ~64px:
 * py-3.5 + the 36px logo mark) so the sticky header's transparent
 * background reveals the photo underneath it on page load, exactly the
 * way HeroBooking already pulls the booking card up over Hero's own
 * bottom edge. The text block gets extra top padding so it clears below
 * the header instead of sitting under it.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const trustItems = t("compactTrustLine").split(" · ");

  return (
    <section className="relative isolate -mt-16 flex min-h-[520px] flex-col justify-center overflow-hidden bg-ink pb-16 pt-28 sm:min-h-[620px] sm:pb-20 sm:pt-32 lg:min-h-[720px] lg:pb-24">
      <Image
        src={heroPhoto.url}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[42%_55%] opacity-90"
      />
      {/* Bottom-heavy navy scrim: nearly opaque where the text/booking
          card sit, fading out toward the top so the photo still reads —
          and dark enough at the very top that the transparent header's
          white logo/nav stay legible over the sky/tarmac. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/50"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-2xl font-bold text-brand sm:text-3xl">
          {t("heroPrice", { price: CHEAPEST_SCHIPHOL_PRICE })}
        </p>
        <p className="mt-2 text-base text-white/80 sm:text-lg">{t("subtitle")}</p>

        <Link
          href="/#boeken"
          className="mt-7 inline-block rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition duration-150 hover:bg-brand-dark hover:shadow-elevated"
        >
          {t("ctaPrimary")}
        </Link>

        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/80">
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
