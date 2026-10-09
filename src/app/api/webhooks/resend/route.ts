import { NextResponse } from "next/server";
import { Webhook, WebhookVerificationError } from "svix";
import { prisma } from "@/lib/db";
import { sendBounceAlertPushNotification } from "@/lib/pushNotification";

/**
 * Real gap found live: a genuine-looking booking (plausible name, real
 * route, real-ish phone format) turned out to be unreachable by phone,
 * had no WhatsApp, AND its confirmation email bounced — but nothing in
 * the app ever surfaced that last fact; the owner only found it by
 * manually checking Resend's own dashboard. This webhook closes that
 * gap: Resend calls this URL the moment the real receiving mail server
 * rejects a message, which is a far stronger "this probably isn't a
 * real customer" signal than any format-only validation could ever be
 * (an address can look perfectly valid and still not exist).
 *
 * Needs to be registered once in Resend's own dashboard (Webhooks →
 * Add Endpoint → this URL, events: email.bounced + email.complained) —
 * deliberately NOT done automatically from here: creating/modifying a
 * webhook is an account-level, outward-facing change the user needs to
 * take themselves. RESEND_WEBHOOK_SECRET (the "whsec_..." value Resend
 * shows once, at creation) must be set alongside it.
 *
 * Verified with svix (the provider Resend's webhooks are built on) —
 * never trust an unsigned payload claiming a booking's email bounced,
 * that would let anyone flag any booking as suspicious by just POSTing
 * a fake event here.
 */
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    // Not configured yet — fail closed (reject), never silently accept
    // an unverifiable payload.
    return NextResponse.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const svixHeaders = {
    "svix-id": request.headers.get("svix-id") ?? "",
    "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
    "svix-signature": request.headers.get("svix-signature") ?? "",
  };

  try {
    new Webhook(secret).verify(rawBody, svixHeaders);
  } catch (error) {
    if (error instanceof WebhookVerificationError) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }
    throw error;
  }

  const event = JSON.parse(rawBody) as {
    type?: string;
    data?: { to?: string[]; bounce?: { message?: string; type?: string }; subject?: string };
  };

  if (event.type !== "email.bounced" && event.type !== "email.complained") {
    // Any other event type (delivered, opened, ...) — nothing to do,
    // acknowledge so Resend doesn't retry.
    return NextResponse.json({ ok: true, ignored: event.type });
  }

  const recipients = event.data?.to ?? [];
  if (recipients.length === 0) {
    return NextResponse.json({ ok: true, note: "no recipients in payload" });
  }

  const reason =
    event.type === "email.complained"
      ? "Ontvanger markeerde de mail als spam"
      : (event.data?.bounce?.message ?? "Onbekende bounce-reden");

  // Match by email, most recent booking first — a customer could in
  // theory book more than once with the same address; flagging the
  // newest match is the common case (the bounce almost always arrives
  // within minutes of that exact booking's confirmation email).
  let flagged = 0;
  for (const email of recipients) {
    const booking = await prisma.booking.findFirst({
      where: { customerEmail: email, emailBounced: false },
      orderBy: { createdAt: "desc" },
    });
    if (!booking) continue;

    await prisma.booking.update({
      where: { id: booking.id },
      data: { emailBounced: true, emailBounceReason: reason },
    });
    void sendBounceAlertPushNotification(booking, reason);
    flagged++;
  }

  return NextResponse.json({ ok: true, flagged });
}
