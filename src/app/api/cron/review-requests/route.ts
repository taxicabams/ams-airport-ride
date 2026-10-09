import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendReviewRequestEmail } from "@/lib/email";

/**
 * Triggered periodically by an EXTERNAL scheduler (Hostinger's own Cron
 * Jobs panel, or a free service like cron-job.org — this app has no
 * built-in cron runner) to send the "how was your ride?" email roughly
 * a day after each booking's scheduled ride time. Protected by a shared
 * secret (CRON_SECRET) rather than auth/session — there's no concept of
 * a logged-in user anywhere else in this app, and a secret query param
 * is the simplest thing an external cron service can actually send.
 *
 * Deliberately filters candidates in JS, not SQL: `date`/`time` are
 * separate plain strings (see schema.prisma's own note on Booking.date),
 * and at this app's real booking volume, fetching a bounded recent
 * window and filtering in memory is simpler and plenty fast — no need
 * for a raw-SQL date-math query.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const provided = new URL(request.url).searchParams.get("secret");
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const SEND_AFTER_MS = 20 * 60 * 60 * 1000; // ~20h after the ride — see note below
  const WINDOW_DAYS = 14; // bookings older than this are assumed handled/stale, never retried forever

  const candidates = await prisma.booking.findMany({
    where: {
      reviewRequestSentAt: null,
      status: { not: "CANCELLED" },
      createdAt: { gte: new Date(now - WINDOW_DAYS * 24 * 60 * 60 * 1000) },
    },
  });

  let sent = 0;
  for (const booking of candidates) {
    // Guards against this session's own test bookings (see audits this
    // pass) ever getting a real email — matched the same way those were
    // identified when checking the database directly.
    if (/test/i.test(booking.notes ?? "") || /test/i.test(booking.customerEmail)) continue;

    const rideTime = new Date(`${booking.date}T${booking.time}`);
    if (Number.isNaN(rideTime.getTime())) continue;
    // Not yet 20h past the ride — too early to ask, try again next run.
    if (now - rideTime.getTime() < SEND_AFTER_MS) continue;

    const locale = booking.locale === "en" ? "en" : "nl";
    await sendReviewRequestEmail(booking, locale);
    await prisma.booking.update({
      where: { id: booking.id },
      data: { reviewRequestSentAt: new Date() },
    });
    sent++;
  }

  return NextResponse.json({ checked: candidates.length, sent });
}
