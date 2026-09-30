import { getTranslations } from "next-intl/server";
import { CheckIcon } from "@/components/ui/icons";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";

/**
 * "Vertrekbord" hero — two-column spec: left column is the pitch
 * (labels, heading, subtext, trust checkmarks), right column is the
 * actual booking card (BookingWidget rendered directly, not floated
 * below on a separate row like the previous Layout 4.0 hero).
 * BookingWidget's own internals are untouched — only where it's placed
 * changed.
 *
 * Per explicit client feedback this pass: the Google-review-score line,
 * the ILT/KvK line and the payment-logo line are all removed — none of
 * them were wanted (Google reviews are being replaced by the site's own
 * database-backed reviews — see Reviews.tsx — and ILT/KvK/iDEAL were
 * simply "hoef ik niet").
 *
 * Mobile order flipped per direct feedback ("via mobiel komt er eerst
 * nog hele stuk met die titel etc" — the booking card should be the
 * very first thing visible on a phone, not after a full screen of hero
 * copy): the booking column gets `order-1` (first) below the `lg`
 * breakpoint and `lg:order-2` (back to its natural second/right-column
 * position) at desktop width; the text column is `order-2 lg:order-1`.
 * Pure CSS reorder — the DOM/markup order (and therefore reading order
 * for screen readers) is unchanged, only the visual position moves.
 *
 * A real, concrete "Vaste prijs vanaf €X" badge now sits directly above
 * the booking card itself (not just implied by the "Vaste prijs" text
 * in the H1) — per direct feedback that the cheap fixed price is very
 * important and needs to be unmistakable the instant the site opens.
 * Living in this column means it's genuinely the first thing shown on
 * mobile (this column is order-1 there) and still immediately visible
 * on desktop next to the booking card.
 */
export async function Hero() {
  const t = await getTranslations("Hero");
  const trustItems = t("compactTrustLine").split(" · ");

  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-16">
        <div className="order-2 lg:order-1">
          <div className="flex flex-wrap gap-2">
            {[t("label1"), t("label2"), t("label3")].map((label) => (
              <span
                key={label}
                className="rounded-[10px] border border-brand/40 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-brand"
              >
                {label}
              </span>
            ))}
          </div>

          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            {t("title")} <span className="text-brand">{t("titleHighlight")}</span>
          </h1>

          <p className="mt-4 max-w-lg text-ink-foreground-muted">{t("subtitle")}</p>
        </div>

        {/* Not id="boeken" here too — BookingWidget's own root already
            has that id (a real duplicate-id bug otherwise: two elements
            sharing one id is invalid HTML and makes "#boeken" anchor
            behavior/getElementById ambiguous).

            min-w-0 is the real fix for a bug the client found live with
            a real phone screenshot: at QuoteStep (booking step 3), a
            long destination address ("Euclideslaan 201, 3584 BS
            Utrecht, Netherlands") pushed the page's dark full-bleed
            background sections narrower than the real viewport,
            revealing a strip of the page's own cream background on the
            right. Classic CSS grid gotcha: a grid item's default
            min-width is `auto`, not `0` — meaning it refuses to shrink
            below its content's natural (min-content) size even when
            that content has `overflow-hidden`/`truncate` on it.
            QuoteStep's route line (`<p className="truncate">{pickup} →
            {destination}</p>`) uses `white-space: nowrap` under the
            hood, whose min-content width is its FULL unwrapped text
            width — with a long address, that's wide enough to inflate
            this grid item (and therefore this whole grid row) past the
            viewport, before `truncate` ever gets a chance to clip
            anything. min-w-0 tells the grid track sizing algorithm this
            item may shrink below that content-driven minimum, which is
            what actually lets the descendant `truncate` do its job. */}
        <div className="order-1 min-w-0 scroll-mt-24 lg:order-2">
          <p className="mb-3 inline-flex items-center gap-2 rounded-[10px] bg-brand px-4 py-2 font-mono text-base font-bold text-brand-foreground sm:text-lg">
            {t("heroPrice", { price: CHEAPEST_SCHIPHOL_PRICE })}
          </p>
          <BookingWidget />
          <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-medium text-ink-foreground-muted">
            {trustItems.map((item) => (
              <li key={item} className="flex items-center gap-1.5">
                <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
