import { getTranslations } from "next-intl/server";
import { StarIcon } from "@/components/ui/icons";
import { prisma } from "@/lib/db";

/**
 * Real reviews from AMS Airport Ride's own database — replaces the
 * Google-reviews section entirely, per direct feedback ("google review
 * hoeft niet, me eigen review gekoppeld aan mijn database"). Reads
 * published Review rows directly (see prisma/schema.prisma) — nothing
 * here is invented; an empty result renders the honest "coming soon"
 * message, never a placeholder star rating or fabricated quote.
 *
 * Wrapped in try/catch because the Review table's migration has NOT
 * been run against the live database yet (a schema migration wasn't run
 * without explicit confirmation, per this session's "don't deploy
 * anything without my review" instruction) — until it has, this
 * degrades to the empty state instead of crashing the homepage.
 */
export async function Reviews() {
  const t = await getTranslations("Reviews");

  let reviews: { id: string; customerName: string; rating: number; comment: string }[] = [];
  try {
    reviews = await prisma.review.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 9,
      select: { id: true, customerName: true, rating: true, comment: true },
    });
  } catch {
    reviews = [];
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

  return (
    <section id="reviews" className="scroll-mt-24 mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text">{t("eyebrow")}</p>
        <h2 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {t("title")}
        </h2>
        {averageRating !== null && (
          <p className="mt-3 flex items-center justify-center gap-2 font-mono text-sm text-muted">
            <span className="flex items-center gap-0.5 text-brand">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className={`h-4 w-4 ${i < Math.round(averageRating) ? "" : "opacity-25"}`} />
              ))}
            </span>
            {averageRating.toFixed(1)} · {reviews.length} reviews
          </p>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="rounded-[18px] border border-border bg-surface p-5">
              <span className="flex items-center gap-0.5 text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "" : "opacity-25"}`} />
                ))}
              </span>
              <p className="mt-2 text-sm text-muted">{review.comment}</p>
              <p className="mt-3 text-sm font-semibold text-foreground">{review.customerName}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-muted">{t("empty")}</p>
      )}
    </section>
  );
}
