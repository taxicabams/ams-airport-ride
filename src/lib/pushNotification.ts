import type { Booking } from "@/generated/prisma/client";
import { bookingReference } from "./bookingReference";

/**
 * Instant phone push notification on every new booking, via ntfy.sh — a
 * free, no-account-needed push service: POSTing to
 * `https://ntfy.sh/<topic>` delivers a push notification to anyone who
 * has the ntfy app subscribed to that exact topic. No API key, no
 * signup, nothing to rotate; the topic name itself is the only secret
 * (treat it like a password — anyone who learns it can subscribe to
 * your bookings), which is why it's a server-only env var
 * (NTFY_TOPIC), never NEXT_PUBLIC_.
 *
 * Added per direct feedback: the existing email notification
 * (sendBookingEmails's internal-notification half) sometimes landed in
 * Gmail's "Overig" tab and got missed — this is a second, independent
 * channel, not a replacement. Same fire-and-forget pattern as
 * sendBookingEmails: never throws, never delays or fails the booking
 * API response, and silently does nothing if NTFY_TOPIC isn't
 * configured (same "optional until the client sets a real value"
 * pattern as RESEND_API_KEY/GOOGLE_MAPS_API_KEY).
 */
export async function sendBookingPushNotification(booking: Booking): Promise<void> {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) return;

  const ref = bookingReference(booking);
  const vehicle = booking.vehicleType === "BUS" ? "XL Van" : "Comfort";
  const route = `${booking.pickupAddress} → ${booking.destination}`;
  const when = `${booking.date} ${booking.time}`;

  try {
    const response = await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
      method: "POST",
      headers: {
        // ntfy reads these as Latin-1 by default — €/→ need explicit
        // UTF-8 encoding or they render as mojibake in the push preview.
        Title: `Nieuwe boeking ${ref} — €${booking.totalPrice}`,
        Priority: "high",
        Tags: "taxi,moneybag",
        "Content-Type": "text/plain; charset=utf-8",
      },
      body: `${route}\n${when} · ${booking.passengers} pers · ${vehicle}\n${booking.customerName} · ${booking.customerPhone}`,
    });
    if (!response.ok) {
      console.error(`[pushNotification] ntfy.sh returned ${response.status} for booking ${ref}`);
    }
  } catch (error) {
    // Never let a flaky push service affect the booking itself — the
    // email notification is still the reliable fallback.
    console.error("[pushNotification] Failed to send push notification:", error);
  }
}
