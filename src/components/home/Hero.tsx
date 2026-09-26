import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CheckIcon } from "@/components/ui/icons";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";
import { heroPhoto } from "@/lib/heroPhoto";

/**
 * v13 — restored, compactly, after over-trimming in v12. The client's
 * own reference mockup keeps eyebrow, title, price line, subtitle, CTA
 * button, and the trust-checkmark row all together, in the hero, dense
 * — "compact" meant tighter spacing, not fewer elements. Cutting the
 * price/CTA/checkmarks in v12 was the wrong fix for the right complaint
 * ("the booking should appear sooner"): the fix is tighter padding, not
 * a thinner hero. Now uses a real vehicle photo (see heroPhoto.ts) —
 * finalCtaPhoto (a plane silhouette, no vehicle) was a placeholder used
 * while a proper photo search was still pending.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const trustItems = t("compactTrustLine").split(" · ");

  return (
    <section className="relative isolate overflow-hidden bg-ink pb-8 pt-8 sm:pb-10 sm:pt-10">
      <Image
        src={heroPhoto.url}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[42%_60%] opacity-90"
      />
      {/* Bottom-heavy navy scrim: nearly opaque where the text/booking
          card sit, fading out toward the top so the photo still reads. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/30"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-white/70">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-1.5 text-xl font-bold text-brand sm:text-2xl">
          {t("heroPrice", { price: CHEAPEST_SCHIPHOL_PRICE })}
        </p>
        <p className="mt-1.5 text-base text-white/80">{t("subtitle")}</p>

        <Link
          href="/#boeken"
          className="mt-4 inline-block rounded-full bg-brand px-6 py-3 text-base font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark"
        >
          {t("ctaPrimary")}
        </Link>

        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm font-medium text-white/80">
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
