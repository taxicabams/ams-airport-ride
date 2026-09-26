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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Brand colors, hardcoded rather than read from globals.css's CSS
// variables — email clients don't reliably support CSS custom
// properties (or even <style> in some webmail contexts), so every
// transactional email inlines the site's *light*-theme palette
// directly. Keep these in sync with src/app/globals.css's :root block
// (brand system v3) if that palette ever changes.
const BRAND_NAVY = "#0b1728"; // --ink
const BRAND_BLUE = "#1769a8"; // --brand
const TEXT = "#111827";
const MUTED = "#64748b";
const BORDER = "#e2e8f0";
const MUTED_BG = "#f5f7fa";

// Hosted on the live domain, not a relative path — email <img> tags need
// a real, publicly reachable URL regardless of which host renders the
// message. Exported once from the same LogoMark markup used on the site
// (src/components/ui/Logo.tsx) via a browser screenshot — see the plan
// note in that file's history for why email can't just inline the SVG
// (Outlook's Word rendering engine doesn't support it reliably).
const LOGO_URL = "https://amsairportride.nl/images/logo-mark.png";
const SITE_URL = "https://amsairportride.nl";

/**
 * Shared wrapper every outgoing email renders through — one place that
 * defines "what an AMS Airport Ride email looks like" (logo header,
 * flight-path divider, white content card, footer) instead of each email
 * hand-rolling its own HTML. Table-based layout + inline styles
 * throughout: the safest, most widely-compatible approach across email
 * clients (Gmail, Outlook, Apple Mail), none of which reliably render a
 * <style> block or flexbox/grid the way a browser does.
 *
 * The flight-path divider ("AMS ─── ✈ ─── SCHIPHOL") is plain text, not
 * the site's SVG component (src/components/marketing/FlightPathDivider.tsx)
 * — email clients can't render arbitrary inline SVG reliably, and a
 * second hosted image just for this is unnecessary when the same motif
 * works fine as text.
 */
function emailLayout(bodyHtml: string, footerNote: string): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body style="margin:0;padding:0;background-color:${MUTED_BG};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${MUTED_BG};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${BORDER};">
            <tr>
              <td style="background-color:${BRAND_NAVY};padding:24px 28px 18px;" align="center">
                <img src="${LOGO_URL}" width="40" height="40" alt="AMS Airport Ride" style="display:block;margin:0 auto 10px;border-radius:10px;" />
                <div style="color:#ffffff;font-size:16px;font-weight:700;letter-spacing:-0.01em;">AMS Airport Ride</div>
                <div style="margin-top:10px;color:#9db8cc;font-size:11px;letter-spacing:0.06em;">
                  AMS&nbsp;&nbsp;──────&nbsp;✈&nbsp;──────&nbsp;&nbsp;SCHIPHOL
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;color:${TEXT};font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;border-top:1px solid ${BORDER};color:${MUTED};font-size:12px;line-height:1.5;">
                ${footerNote}
                <div style="margin-top:8px;">
                  AMS Airport Ride — Schiphol &amp; Amsterdam Airport Transfers ·
                  <a href="${SITE_URL}" style="color:${BRAND_BLUE};text-decoration:none;">amsairportride.nl</a>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;color:${MUTED};font-size:14px;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:${TEXT};font-size:14px;font-weight:600;text-align:right;">${escapeHtml(value)}</td>
  </tr>`;
}

function customerEmailBody(booking: Booking, locale: "nl" | "en"): string {
  const isAirport = booking.rideType === "AIRPORT_TRANSFER";
  const t =
    locale === "nl"
      ? {
          title: "Uw boeking is bevestigd",
          intro: "Bedankt voor uw boeking! Hieronder vindt u de gegevens van uw rit.",
          ref: "Boekingsnummer",
          pickup: "Ophaaladres",
          destination: "Bestemming",
          when: "Datum en tijd",
          priceLabel: "Vaste prijs",
          flight: "Vluchtnummer",
          paymentTitle: "Betaling",
          payment:
            "Vaste prijs vooraf — geen taxameter, geen verrassingen achteraf. Betaal eenvoudig na de rit rechtstreeks aan de chauffeur met PIN of contant. Een bon is beschikbaar in de taxi.",
          schiphol: "Waar vindt u uw chauffeur?",
          footer: "Dit is een automatisch gegenereerde boekingsbevestiging van AMS Airport Ride.",
        }
      : {
          title: "Your booking is confirmed",
          intro: "Thank you for your booking! Your ride details are below.",
          ref: "Booking reference",
          pickup: "Pickup address",
          destination: "Destination",
          when: "Date and time",
          priceLabel: "Fixed price",
          flight: "Flight number",
          paymentTitle: "Payment",
          payment:
            "Fixed price upfront — no meter, no surprises afterwards. Pay easily after your ride directly to the driver by card or cash. A receipt is available in the taxi.",
          schiphol: "Where will you find your driver?",
          footer: "This is an automated booking confirmation from AMS Airport Ride.",
        };

  // The extra detail rows (date/time, flight number) below the
  // pickup/destination block, same two-column layout as before.
  const extraRows = [detailRow(t.when, `${booking.date} ${booking.time}`)];
  if (isAirport && booking.flightNumber) {
    extraRows.push(detailRow(t.flight, booking.flightNumber));
  }

  // Stacked PICKUP -> DESTINATION block per the brand brief, instead of
  // two plain rows in the same table as date/time/flight — every field
  // is still the same real booking.* value, nothing renamed.
  const tripCard = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${MUTED_BG};border-radius:10px;margin-bottom:16px;">
      <tr>
        <td style="padding:16px 18px 12px;">
          <div style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">${t.pickup}</div>
          <div style="color:${TEXT};font-size:14px;font-weight:600;margin-top:2px;">${escapeHtml(booking.pickupAddress)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 18px;">
          <div style="color:${BRAND_BLUE};font-size:13px;">↓</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 18px 16px;">
          <div style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">${t.destination}</div>
          <div style="color:${TEXT};font-size:14px;font-weight:600;margin-top:2px;">${escapeHtml(booking.destination)}</div>
        </td>
      </tr>
    </table>
  `;

  const body = `
    <h1 style="margin:0 0 4px;font-size:20px;color:${BRAND_NAVY};">${t.title}</h1>
    <p style="margin:0 0 20px;color:${MUTED};font-size:14px;">${t.intro}</p>

    <p style="margin:0 0 16px;color:${MUTED};font-size:12px;">${t.ref}: <span style="font-family:monospace;color:${TEXT};">${escapeHtml(booking.id)}</span></p>

    ${tripCard}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${extraRows.join("\n")}
    </table>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${MUTED_BG};border-radius:10px;margin-bottom:20px;">
      <tr>
        <td style="padding:16px 20px;text-align:center;">
          <div style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:0.03em;">${t.priceLabel}</div>
          <div style="color:${BRAND_BLUE};font-size:28px;font-weight:700;margin-top:4px;">${formatPrice(booking.price)}</div>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 4px;font-weight:600;color:${BRAND_NAVY};font-size:14px;">${t.paymentTitle}</p>
    <p style="margin:0 0 20px;color:${MUTED};font-size:13px;">${t.payment}</p>

    ${
      isAirport
        ? `<div style="border:1px solid ${BRAND_NAVY}22;background-color:${BRAND_NAVY}0d;border-radius:8px;padding:16px 20px;">
            <p style="margin:0 0 6px;font-weight:600;color:${BRAND_NAVY};font-size:14px;">${t.schiphol}</p>
            <p style="margin:0;color:${TEXT};font-size:13px;">${escapeHtml(getSchipholMeetingPointText(locale))}</p>
          </div>`
        : ""
    }
  `;

  return emailLayout(body, t.footer);
}

function internalNotificationBody(booking: Booking, locale: "nl" | "en"): string {
  // The owner's own notification stays in Dutch (that's who reads it),
  // but now names the customer's language explicitly — useful context
  // for calling/texting the customer back in the right language.
  const customerLanguage = locale === "nl" ? "Nederlands" : "Engels";
  const rows = [
    detailRow("Klant", `${booking.customerName} (${customerLanguage})`),
    detailRow("Telefoon", booking.customerPhone),
    detailRow("E-mail", booking.customerEmail),
    detailRow("Van", booking.pickupAddress),
    detailRow("Naar", booking.destination),
    detailRow("Wanneer", `${booking.date} ${booking.time}`),
    detailRow("Passagiers / bagage", `${booking.passengers} / ${booking.luggage}`),
    detailRow("Voertuig", booking.vehicleType === "BUS" ? "Van" : "Comfort"),
    detailRow("Prijs", `${formatPrice(booking.price)} (${booking.priceSource})`),
  ];
  if (booking.flightNumber) rows.push(detailRow("Vluchtnummer", booking.flightNumber));

  const body = `
    <h1 style="margin:0 0 16px;font-size:18px;color:${BRAND_NAVY};">Nieuwe boeking — ${booking.rideType === "AIRPORT_TRANSFER" ? "Schiphol" : "Privérit"}</h1>
    <p style="margin:0 0 16px;color:${MUTED};font-size:12px;">Boekingsnummer: <span style="font-family:monospace;color:${TEXT};">${escapeHtml(booking.id)}</span></p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      ${rows.join("\n")}
    </table>

    ${
      booking.notes
        ? `<p style="margin:0;padding:12px 16px;background-color:${MUTED_BG};border-radius:8px;color:${TEXT};font-size:13px;"><strong>Opmerkingen:</strong> ${escapeHtml(booking.notes)}</p>`
        : ""
    }
  `;

  return emailLayout(body, "Interne boekingsnotificatie van amsairportride.nl.");
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
    // The customer confirmation is always sent in the language they
    // booked in — `locale` comes from the same x-locale header the site
    // itself used for the booking, never guessed or defaulted per
    // recipient address.
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
        html: internalNotificationBody(booking, locale),
      });
    }
  } catch (error) {
    console.error("[email] Failed to send booking emails for", booking.id, error);
  }
}
