import { Resend } from "resend";
import type { Booking } from "@/generated/prisma/client";
import { getSchipholMeetingPointText } from "./schipholMeetingPoint";

// Resend client is created lazily (not at module load) so the app can
// still boot — and every other page can still render — even before
// RESEND_API_KEY is configured; only actually sending an email needs it.
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/**
 * Whether the server is actually able to send email right now.
 * POST /api/bookings reports this back to the client so the
 * confirmation screen never claims "we emailed you" when that's not
 * true yet — see the honesty rule in the plan (no claims we can't back
 * up operationally).
 */
export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

function formatPrice(cents: number): string {
  return `€${cents}`;
}

function customerEmailBody(booking: Booking, locale: "nl" | "en"): string {
  const isAirport = booking.rideType === "AIRPORT_TRANSFER";
  const t =
    locale === "nl"
      ? {
          title: "Uw boeking is bevestigd",
          ref: "Boekingsnummer",
          pickup: "Ophaaladres",
          destination: "Bestemming",
          when: "Datum en tijd",
          price: "Vaste prijs",
          flight: "Vluchtnummer",
          payment: "Vaste prijs vooraf. Betaal eenvoudig na de rit met PIN of contant.",
          schiphol: "Waar vindt u uw chauffeur?",
        }
      : {
          title: "Your booking is confirmed",
          ref: "Booking reference",
          pickup: "Pickup address",
          destination: "Destination",
          when: "Date and time",
          price: "Fixed price",
          flight: "Flight number",
          payment: "Fixed price upfront. Pay easily after your ride with card or cash.",
          schiphol: "Where will you find your driver?",
        };

  const lines = [
    `<h1>${t.title}</h1>`,
    `<p><strong>${t.ref}:</strong> ${booking.id}</p>`,
    `<p><strong>${t.pickup}:</strong> ${booking.pickupAddress}</p>`,
    `<p><strong>${t.destination}:</strong> ${booking.destination}</p>`,
    `<p><strong>${t.when}:</strong> ${booking.date} ${booking.time}</p>`,
    `<p><strong>${t.price}:</strong> ${formatPrice(booking.price)}</p>`,
  ];
  if (isAirport && booking.flightNumber) {
    lines.push(`<p><strong>${t.flight}:</strong> ${booking.flightNumber}</p>`);
  }
  if (isAirport) {
    lines.push(`<h2>${t.schiphol}</h2>`, `<p>${getSchipholMeetingPointText(locale)}</p>`);
  }
  lines.push(`<p>${t.payment}</p>`);
  return lines.join("\n");
}

function internalNotificationBody(booking: Booking): string {
  return [
    `<h1>Nieuwe boeking (${booking.rideType})</h1>`,
    `<p><strong>ID:</strong> ${booking.id}</p>`,
    `<p><strong>Klant:</strong> ${booking.customerName} — ${booking.customerPhone} — ${booking.customerEmail}</p>`,
    `<p><strong>Van:</strong> ${booking.pickupAddress}</p>`,
    `<p><strong>Naar:</strong> ${booking.destination}</p>`,
    `<p><strong>Wanneer:</strong> ${booking.date} ${booking.time}</p>`,
    `<p><strong>Passagiers/bagage:</strong> ${booking.passengers} / ${booking.luggage}</p>`,
    `<p><strong>Voertuig:</strong> ${booking.vehicleType}</p>`,
    `<p><strong>Prijs:</strong> ${formatPrice(booking.price)} (${booking.priceSource})</p>`,
    booking.flightNumber ? `<p><strong>Vlucht:</strong> ${booking.flightNumber}</p>` : "",
    booking.notes ? `<p><strong>Opmerkingen:</strong> ${booking.notes}</p>` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Sends both booking emails (customer confirmation + internal
 * notification). Failures are caught and logged rather than thrown: a
 * flaky email provider should never make POST /api/bookings fail after
 * the booking has already been saved to the database.
 */
export async function sendBookingEmails(booking: Booking, locale: "nl" | "en") {
  const resend = getResendClient();
  if (!resend) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipping booking emails for",
      booking.id
    );
    return;
  }

  const from = process.env.BOOKING_EMAIL_FROM ?? "AMS Airport Ride <onboarding@resend.dev>";
  const companyEmail = process.env.COMPANY_NOTIFICATION_EMAIL;

  try {
    await resend.emails.send({
      from,
      to: booking.customerEmail,
      subject:
        locale === "nl"
          ? `Boekingsbevestiging ${booking.id}`
          : `Booking confirmation ${booking.id}`,
      html: customerEmailBody(booking, locale),
    });

    if (companyEmail) {
      await resend.emails.send({
        from,
        to: companyEmail,
        subject: `Nieuwe boeking: ${booking.pickupAddress} → ${booking.destination}`,
        html: internalNotificationBody(booking),
      });
    }
  } catch (error) {
    console.error("[email] Failed to send booking emails for", booking.id, error);
  }
}
