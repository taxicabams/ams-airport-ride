import { getTranslations } from "next-intl/server";
import { StarIcon } from "@/components/ui/icons";
import { prisma } from "@/lib/db";

/**
 * Real reviews from AMS Airport Ride's own database — replaces the
 * Google-reviews section entirely, per direct feedback ("google review
 * hoeft niet, me eigen review gekoppeld aan mijn database"). Reads
 * published Review rows directly (see prisma/schema.prisma) — nothing
 * here is invented.
 *
 * Renders nothing at all (not an honest-but-still-visible "coming soon"
 * message) while there are zero published reviews — a nav link/section
 * that only ever says "coming soon" is exactly the half-finished
 * production content this site's brief forbids elsewhere, so this stays
 * entirely invisible until the first real review is approved, then
 * appears automatically — no code change needed to "launch" it.
 *
 * Only ever shows a review that has actual written text — direct
 * client concern: the 1-tap rating links in sendReviewRequestEmail
 * (star only, no comment) are genuinely valuable as a quick, private
 * satisfaction signal (an instant push notification either way), but a
 * public page full of nameless, textless "★★★★★" entries reads exactly
 * like something the owner typed themselves, real or not. This filter
 * is the actual fix — not a display-only hide, the DB query itself
 * excludes them, so a star-only review can never be counted in the
 * average rating or the review count either, no matter what `published`
 * ends up set to. A blank *name* (shown as "Anoniem"/"Anonymous") next
 * to real written text is left alone — that combination is completely
 * normal on genuine review sites and isn't the thing that reads as
 * fake; an empty comment is.
 *
 * Still wrapped in try/catch: defensive against the Review table not
 * existing in whatever database this happens to run against (e.g. a
 * fresh local clone before migrations are applied), degrading to
 * invisible rather than a crashed homepage.
 */
export async function Reviews() {
  const t = await getTranslations("Reviews");

  let reviews: { id: string; customerName: string; rating: number; comment: string }[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: { published: true, comment: { not: "" } },
      orderBy: { createdAt: "desc" },
      take: 9,
      select: { id: true, customerName: true, rating: true, comment: true },
    });
  } catch {
    reviews = [];
  }

  if (reviews.length === 0) return null;

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <section id="reviews" className="scroll-mt-24 mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text">{t("eyebrow")}</p>
        <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mt-3 flex items-center justify-center gap-2 font-mono text-sm text-muted">
          <span className="flex items-center gap-0.5 text-brand">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? "" : "opacity-25"}`} />
            ))}
          </span>
          {averageRating.toFixed(1)} · {reviews.length} reviews
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {reviews.slice(0, 3).map((review) => (
          <div key={review.id} className="rounded-[18px] border border-border bg-surface p-5">
            <span className="flex items-center gap-0.5 text-brand">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "" : "opacity-25"}`} />
              ))}
            </span>
            {/* Always real text here — the query above only ever
                returns reviews with a non-empty comment, see this
                file's own note on why. */}
            <p className="mt-2 text-sm text-muted">{review.comment}</p>
            <p className="mt-3 text-sm font-semibold text-foreground">{review.customerName}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
