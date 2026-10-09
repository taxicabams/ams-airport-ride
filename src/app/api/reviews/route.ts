import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendReviewPushNotification } from "@/lib/pushNotification";

/**
 * Real, database-backed reviews — replaces relying on a Google Business
 * profile (none exists yet). See Review model in prisma/schema.prisma
 * for the "published defaults to false" reasoning: nothing submitted
 * here becomes publicly visible on its own.
 *
 * Now wired to a real customer-facing form (src/app/[locale]/review),
 * linked from the review-request email sent ~1 day after each ride (see
 * api/cron/review-requests + lib/email.ts's sendReviewRequestEmail).
 * Moderation still has no dedicated admin UI — a push notification
 * (sendReviewPushNotification) tells the owner to go approve/reject via
 * Supabase's own Table Editor; reviews are only ever surfaced on the
 * site once `published` is flipped to true there. Spam-rate-limited the
 * same way /api/bookings is.
 */
const reviewInputSchema = z.object({
  customerName: z.string().trim().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(1).max(1000),
});

const RATE_LIMIT = { limit: 5, windowMs: 10 * 60_000 };

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(`reviews:${getClientIp(request)}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = reviewInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: { ...parsed.data, published: false },
  });

  // Fire-and-forget, same pattern as the booking notifications — never
  // delays or fails this response.
  void sendReviewPushNotification(review);

  return NextResponse.json({ id: review.id });
}

export async function GET() {
  const reviews = await prisma.review.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 9,
    select: { id: true, customerName: true, rating: true, comment: true },
  });
  return NextResponse.json({ reviews });
}
