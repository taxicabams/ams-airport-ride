import { Resend } from "resend";
import type { Booking } from "@/generated/prisma/client";
import { getSchipholMeetingPointText } from "./schipholMeetingPoint";
import { bookingReference } from "./bookingReference";
import { companyInfo } from "./companyInfo";
import { matchLocation } from "./locations";

/**
 * Real logic bug found in this audit: `booking.rideType` is
 * "AIRPORT_TRANSFER" whenever EITHER side of the (outbound) trip is
 * Schiphol — it doesn't say which side. The email used that one flag to
 * decide whether to show the Schiphol meeting-point block at all, so a
 * customer booking FROM their own address TO Schiphol (a departure —
 * the driver comes to THEM, there's no meeting point to find) saw the
 * exact same "meestal bij het Meeting Point op Schiphol Plaza" text as
 * someone actually landing and needing to find their driver — nonsense
 * for a departure. Worse, for a return booking where the two legs go in
 * opposite directions (e.g. home→Schiphol outbound, Schiphol→home
 * return), the block was always attached to the OUTBOUND leg
 * regardless of which leg was actually the airport arrival.
 *
 * Fixed by checking PICKUP specifically, per leg, independently — not
 * the overall rideType.
 */
function isSchipholPickup(address: string): boolean {
  return matchLocation(address)?.isAirport === true;
}

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
const SUCCESS = "#3ddc84"; // --success — same green as the site's own WhatsApp buttons

/**
 * A WhatsApp CTA button, reused in every email that needs one. Real gap
 * found in this audit: schipholMeetingPoint.ts's own text explicitly
 * promises "bel of app dan het nummer dat u in uw boekingsbevestiging
 * ontvangt" ("call or message the number in your booking confirmation")
 * — but no email (or the on-screen confirmation, see
 * ConfirmationCard.tsx's own fix) ever actually included a number. A
 * customer stranded at Schiphol with no call from their driver had
 * nothing to call or message. Renders nothing when
 * companyInfo.whatsapp is unset — never a fabricated contact method.
 */
function whatsAppButton(label: string): string {
  if (!companyInfo.whatsapp) return "";
  const href = `https://wa.me/${companyInfo.whatsapp}`;
  return `<a href="${href}" style="display:inline-block;margin-top:10px;padding:10px 18px;background-color:${SUCCESS};color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;border-radius:999px;">${escapeHtml(label)}</a>`;
}

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

// Stacked PICKUP -> DESTINATION block per the brand brief. Takes an
// optional `label` (e.g. "Heenreis" / "Retourreis") so the same markup
// renders both the outbound and, for a return booking, the return leg —
// previously this was inlined once in customerEmailBody with no way to
// render a second trip, which is the direct cause of the return-trip
// bug documented below.
function tripCard(pickup: string, destination: string, pickupLabel: string, destinationLabel: string, legLabel?: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${MUTED_BG};border-radius:10px;margin-bottom:12px;">
      ${legLabel ? `<tr><td style="padding:12px 18px 0;"><div style="color:${BRAND_BLUE};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">${escapeHtml(legLabel)}</div></td></tr>` : ""}
      <tr>
        <td style="padding:${legLabel ? "8px" : "16px"} 18px 12px;">
          <div style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">${pickupLabel}</div>
          <div style="color:${TEXT};font-size:14px;font-weight:600;margin-top:2px;">${escapeHtml(pickup)}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 18px;">
          <div style="color:${BRAND_BLUE};font-size:13px;">↓</div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 18px 16px;">
          <div style="color:${MUTED};font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">${destinationLabel}</div>
          <div style="color:${TEXT};font-size:14px;font-weight:600;margin-top:2px;">${escapeHtml(destination)}</div>
        </td>
      </tr>
    </table>
  `;
}

function customerEmailBody(booking: Booking, locale: "nl" | "en"): string {
  const isReturn = booking.returnTrip && booking.returnPickup && booking.returnDestination;
  // Computed per leg, independently — see isSchipholPickup's own note on
  // why the old single `isAirport` flag wasn't enough.
  const outboundIsSchipholPickup = isSchipholPickup(booking.pickupAddress);
  const returnIsSchipholPickup = isReturn ? isSchipholPickup(booking.returnPickup!) : false;

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
          totalLabel: "Totaalprijs",
          outboundLabel: "Heenreis",
          returnLabel: "Retourreis",
          flight: "Vluchtnummer",
          paymentTitle: "Betaling",
          payment:
            "Vaste prijs vooraf — geen taxameter, geen verrassingen achteraf. Betaal eenvoudig na de rit rechtstreeks aan de chauffeur met PIN of contant. Een bon is beschikbaar in de taxi.",
          schiphol: "Waar vindt u uw chauffeur?",
          pickupTitle: "Uw chauffeur komt naar u toe",
          pickupBody: "Zorg dat u op het opgegeven ophaaladres klaarstaat rond de afgesproken tijd.",
          childSeatLabel: "Kinderzitje",
          childSeatValue: "Ja, aangevraagd",
          whatsappCta: "App ons",
          contactTitle: "Vragen over uw rit?",
          contactBody: "Neem gerust contact op via WhatsApp — ook als u uw boeking nog wilt wijzigen.",
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
          totalLabel: "Total price",
          outboundLabel: "Outbound trip",
          returnLabel: "Return trip",
          flight: "Flight number",
          paymentTitle: "Payment",
          payment:
            "Fixed price upfront — no meter, no surprises afterwards. Pay easily after your ride directly to the driver by card or cash. A receipt is available in the taxi.",
          schiphol: "Where will you find your driver?",
          pickupTitle: "Your driver will come to you",
          pickupBody: "Please be ready at the pickup address you provided around the agreed time.",
          childSeatLabel: "Child seat",
          childSeatValue: "Yes, requested",
          whatsappCta: "Message us",
          contactTitle: "Questions about your ride?",
          contactBody: "Feel free to reach out on WhatsApp — also if you'd like to change your booking.",
          footer: "This is an automated booking confirmation from AMS Airport Ride.",
        };

  // One info block per leg: the Schiphol meeting-point block ONLY when
  // THAT leg's pickup is genuinely Schiphol (an arrival), otherwise the
  // "your driver comes to you" block — both end with the same WhatsApp
  // button, since that's the one contact method every booking has
  // regardless of direction.
  function legInfoBlock(legPickupIsSchiphol: boolean): string {
    return legPickupIsSchiphol
      ? `<div style="border:1px solid ${BRAND_NAVY}22;background-color:${BRAND_NAVY}0d;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
          <p style="margin:0 0 6px;font-weight:600;color:${BRAND_NAVY};font-size:14px;">${t.schiphol}</p>
          <p style="margin:0;color:${TEXT};font-size:13px;">${escapeHtml(getSchipholMeetingPointText(locale))}</p>
          ${whatsAppButton(t.whatsappCta)}
        </div>`
      : `<div style="border:1px solid ${BORDER};border-radius:8px;padding:16px 20px;margin-bottom:20px;">
          <p style="margin:0 0 6px;font-weight:600;color:${BRAND_NAVY};font-size:14px;">${t.pickupTitle}</p>
          <p style="margin:0;color:${TEXT};font-size:13px;">${t.pickupBody}</p>
          ${whatsAppButton(t.whatsappCta)}
        </div>`;
  }

  // Outbound trip: date/time row, plus flight number when this leg is
  // genuinely a Schiphol arrival (a flight number only ever matters for
  // the leg that starts at Schiphol, not a departure leg that ends
  // there).
  const outboundRows = [detailRow(t.when, `${booking.date} ${booking.time}`)];
  if (outboundIsSchipholPickup && booking.flightNumber) {
    outboundRows.push(detailRow(t.flight, booking.flightNumber));
  }
  // Real gap found in this audit: "Kinderzitje nodig" (ContactStep.tsx)
  // was saved to the database but never shown back to the customer
  // anywhere — no confirmation that their request was actually
  // registered. Shown once on the outbound block (a seat request isn't
  // leg-specific), only when actually requested.
  if (booking.childSeat) {
    outboundRows.push(detailRow(t.childSeatLabel, t.childSeatValue));
  }

  // Real bug found in this audit: a return booking's confirmation email
  // never mentioned the return leg at all (no return date/time/route)
  // and showed `booking.price` — the OUTBOUND price only — as if it were
  // the full amount, silently omitting `booking.returnPrice`. A customer
  // who booked a return trip got an email quoting a lower price than
  // they'll actually be charged, with no record of their return ride's
  // date/time. Fixed by rendering a second trip card + date row for the
  // return leg (only when returnTrip is true and the addresses are
  // actually present — same guard route.ts uses), and by always using
  // `booking.totalPrice` (price + returnPrice, or just price when there
  // is no return leg — see route.ts's computation) as the one number
  // shown as "the price", with a two-line breakdown above it whenever
  // there are two legs to break down.
  const returnSection = isReturn
    ? `
      ${tripCard(booking.returnPickup!, booking.returnDestination!, t.pickup, t.destination, t.returnLabel)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
        ${detailRow(t.when, `${booking.returnDate ?? "—"} ${booking.returnTime ?? ""}`.trim())}
      </table>
      ${legInfoBlock(returnIsSchipholPickup)}
    `
    : "";

  const priceBreakdown = isReturn
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
        ${detailRow(t.outboundLabel, formatPrice(booking.price))}
        ${detailRow(t.returnLabel, formatPrice(booking.returnPrice ?? 0))}
      </table>
    `
    : "";

  const body = `
    <h1 style="margin:0 0 4px;font-size:20px;color:${BRAND_NAVY};">${t.title}</h1>
    <p style="margin:0 0 20px;color:${MUTED};font-size:14px;">${t.intro}</p>

    <p style="margin:0 0 16px;color:${MUTED};font-size:14px;">${t.ref}: <span style="font-family:monospace;font-weight:700;color:${BRAND_NAVY};">${escapeHtml(bookingReference(booking))}</span></p>

    ${tripCard(booking.pickupAddress, booking.destination, t.pickup, t.destination, isReturn ? t.outboundLabel : undefined)}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${outboundRows.join("\n")}
    </table>

    ${legInfoBlock(outboundIsSchipholPickup)}

    ${returnSection}

    ${priceBreakdown}

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${MUTED_BG};border-radius:10px;margin-bottom:20px;">
      <tr>
        <td style="padding:16px 20px;text-align:center;">
          <div style="color:${MUTED};font-size:12px;text-transform:uppercase;letter-spacing:0.03em;">${isReturn ? t.totalLabel : t.priceLabel}</div>
          <div style="color:${BRAND_BLUE};font-size:28px;font-weight:700;margin-top:4px;">${formatPrice(booking.totalPrice)}</div>
        </td>
      </tr>
    </table>

    <p style="margin:0 0 4px;font-weight:600;color:${BRAND_NAVY};font-size:14px;">${t.paymentTitle}</p>
    <p style="margin:0;color:${MUTED};font-size:13px;">${t.payment}</p>
  `;

  return emailLayout(body, t.footer);
}

function internalNotificationBody(booking: Booking, locale: "nl" | "en"): string {
  // The owner's own notification stays in Dutch (that's who reads it),
  // but now names the customer's language explicitly — useful context
  // for calling/texting the customer back in the right language.
  const customerLanguage = locale === "nl" ? "Nederlands" : "Engels";
  const isReturn = booking.returnTrip && booking.returnPickup && booking.returnDestination;
  const rows = [
    detailRow("Klant", `${booking.customerName} (${customerLanguage})`),
    detailRow("Telefoon", booking.customerPhone),
    detailRow("E-mail", booking.customerEmail),
    detailRow("Van", booking.pickupAddress),
    detailRow("Naar", booking.destination),
    detailRow("Wanneer", `${booking.date} ${booking.time}`),
    detailRow("Passagiers / bagage", `${booking.passengers} / ${booking.luggage}`),
    detailRow("Voertuig", booking.vehicleType === "BUS" ? "XL Van" : "Comfort"),
  ];
  if (booking.flightNumber) rows.push(detailRow("Vluchtnummer", booking.flightNumber));
  // Real gap found in this audit: the customer-facing "Kinderzitje
  // nodig" checkbox (ContactStep.tsx) writes `childSeat` to the
  // database, but nothing downstream ever showed it again — not this
  // notification, not the customer's own confirmation (see
  // ConfirmationCard.tsx's own fix), nowhere. The driver had no way of
  // knowing a child seat was requested short of opening the database.
  // Only shown when true — a checkbox nobody ticked needs no row.
  if (booking.childSeat) rows.push(detailRow("Kinderzitje", "Ja, nodig"));

  // Same real bug as the customer email (see that function's note): the
  // driver-facing internal notification also silently dropped the
  // return leg entirely and showed only the outbound price. Fixed the
  // same way — an explicit return-trip row block plus the correct
  // grand total.
  if (isReturn) {
    rows.push(detailRow("Retour van", booking.returnPickup!));
    rows.push(detailRow("Retour naar", booking.returnDestination!));
    rows.push(detailRow("Retour wanneer", `${booking.returnDate ?? "—"} ${booking.returnTime ?? ""}`.trim()));
    rows.push(detailRow("Prijs heenreis", `${formatPrice(booking.price)} (${booking.priceSource})`));
    rows.push(
      detailRow(
        "Prijs retour",
        `${formatPrice(booking.returnPrice ?? 0)} (${booking.priceSource})`
      )
    );
    rows.push(detailRow("Totaalprijs", formatPrice(booking.totalPrice)));
  } else {
    rows.push(detailRow("Prijs", `${formatPrice(booking.totalPrice)} (${booking.priceSource})`));
  }

  const body = `
    <h1 style="margin:0 0 16px;font-size:18px;color:${BRAND_NAVY};">Nieuwe boeking — ${booking.rideType === "AIRPORT_TRANSFER" ? "Schiphol" : "Privérit"}${isReturn ? " (retour)" : ""}</h1>
    <p style="margin:0 0 16px;color:${MUTED};font-size:12px;">Boekingsnummer: <span style="font-family:monospace;color:${TEXT};">${escapeHtml(bookingReference(booking))}</span></p>

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
          ? `Boekingsbevestiging ${bookingReference(booking)}`
          : `Booking confirmation ${bookingReference(booking)}`,
      html: customerEmailBody(booking, locale),
    });

    if (companyEmail) {
      await resend.emails.send({
        from,
        to: companyEmail,
        subject: `Nieuwe boeking${booking.returnTrip ? " (retour)" : ""}: ${booking.pickupAddress} → ${booking.destination}`,
        html: internalNotificationBody(booking, locale),
      });
    }
  } catch (error) {
    console.error("[email] Failed to send booking emails for", booking.id, error);
  }
}

/**
 * Review-request email — sent once per booking, roughly a day after the
 * ride, by the review-request cron (see api/cron/review-requests). Short
 * and plain on purpose: this asks for a real opinion, not a marketing
 * push, so it skips any discount/urgency framing and just links to the
 * site's own review form. Never claims an existing rating/review count
 * (see Reviews.tsx/companyInfo.ts's own "never fabricate" convention) —
 * this email is how real reviews get created in the first place.
 *
 * The 5 stars are each their own link straight to `/review?rating=N` —
 * ReviewForm pre-selects that rating on load (see its own note). This
 * is the single biggest lever for response rate on this kind of email:
 * a reviewer who's already decided "it was great" can go from inbox to
 * submitted in one tap (rating pre-filled, name/comment both optional —
 * see ReviewForm/the Review API's own notes on why), instead of having
 * to land on a page, re-decide a rating from scratch, and then face two
 * more fields before they can submit anything at all.
 */
export async function sendReviewRequestEmail(booking: Booking, locale: "nl" | "en"): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[email] RESEND_API_KEY is not set — skipping review request for", booking.id);
    return;
  }

  const from = process.env.BOOKING_EMAIL_FROM ?? "AMS Airport Ride <onboarding@resend.dev>";
  const reviewUrl = locale === "nl" ? `${SITE_URL}/review` : `${SITE_URL}/en/review`;
  const name = escapeHtml(booking.customerName.split(" ")[0] || booking.customerName);

  // Plain-text ★ character, not the site's StarIcon SVG — same
  // reasoning as the flight-path divider in emailLayout: email clients
  // can't reliably render inline SVG, but a star glyph at a large font
  // size looks identical in practice and needs no hosted image.
  //
  // One compact row, ONE star per cell (not a repeated "N of 5 filled"
  // block per link — an earlier version of this showed all 5 stars in
  // EACH of the 5 cells, which overflowed the email's own 560px content
  // width once laid out side by side, see this function's commit
  // history). Reads left-to-right exactly like the site's own star
  // picker (DetailsStep/ReviewForm): tapping the 3rd star means "3".
  // The number underneath each one removes any doubt on a phone where
  // the row might wrap or compress.
  const starLinks = [1, 2, 3, 4, 5]
    .map(
      (n) => `<td style="text-align:center;padding:0 10px;">
                <a href="${reviewUrl}?rating=${n}" style="display:block;text-decoration:none;color:${BRAND_BLUE};font-size:32px;line-height:1;">★</a>
                <a href="${reviewUrl}?rating=${n}" style="display:block;text-decoration:none;color:${MUTED};font-size:12px;font-weight:700;margin-top:4px;">${n}</a>
              </td>`
    )
    .join("");

  const body =
    locale === "nl"
      ? `<p>Hoi ${name},</p>
         <p>Bedankt dat u met ons heeft gereisd! Hoe was uw rit? Eén tik op het aantal sterren is genoeg:</p>
         <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto;"><tr>${starLinks}</tr></table>
         <p style="text-align:center;color:${MUTED};font-size:13px;margin:16px 0 0;">
           Liever eerst iets opschrijven? <a href="${reviewUrl}" style="color:${BRAND_BLUE};">Open het formulier →</a>
         </p>
         <p style="color:${MUTED};font-size:13px;margin-top:20px;">Geen zin? Dan hoeft u niets te doen — fijne reis verder.</p>`
      : `<p>Hi ${name},</p>
         <p>Thanks for riding with us! How was your ride? One tap on a star rating is all it takes:</p>
         <table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px auto;"><tr>${starLinks}</tr></table>
         <p style="text-align:center;color:${MUTED};font-size:13px;margin:16px 0 0;">
           Prefer to write something first? <a href="${reviewUrl}" style="color:${BRAND_BLUE};">Open the form →</a>
         </p>
         <p style="color:${MUTED};font-size:13px;margin-top:20px;">Not feeling it? No action needed — safe travels.</p>`;

  try {
    await resend.emails.send({
      from,
      to: booking.customerEmail,
      subject: locale === "nl" ? "Hoe was uw rit met AMS Airport Ride?" : "How was your ride with AMS Airport Ride?",
      html: emailLayout(
        body,
        locale === "nl"
          ? `Boekingsreferentie ${bookingReference(booking)}.`
          : `Booking reference ${bookingReference(booking)}.`
      ),
    });
  } catch (error) {
    console.error("[email] Failed to send review request for", booking.id, error);
  }
}
