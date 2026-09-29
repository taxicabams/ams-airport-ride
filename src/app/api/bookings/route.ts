import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { computeQuoteWithRoute } from "@/lib/computeQuote";
import { bookingInputSchema } from "@/lib/validation";
import { sendBookingEmails, isEmailConfigured } from "@/lib/email";
import { bookingReference } from "@/lib/bookingReference";
import { routing } from "@/i18n/routing";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Tighter than the read-only endpoints — this writes a row and triggers
// real emails, so a handful of genuine attempts (including a retry after
// a transient failure) fits comfortably while a scripted flood doesn't.
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60_000 };

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(`bookings:${getClientIp(request)}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = bookingInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const input = parsed.data;

  try {
    // Always recompute the price from scratch on the server — the price a
    // client sent along with the form could have been edited in devtools,
    // so the number we actually charge/store must never come from the
    // request body. Same pricing engine, same Google Routes lookup as
    // /api/quote (see computeQuoteWithRoute) — never a second,
    // hand-rolled calculation that could drift from what the customer
    // was shown.
    const quote = await computeQuoteWithRoute({
      pickup: input.pickup,
      destination: input.destination,
      vehicleType: input.vehicleType,
      pickupLat: input.pickupLat,
      pickupLng: input.pickupLng,
      destinationLat: input.destinationLat,
      destinationLng: input.destinationLng,
      // Applied once, to the outbound leg only — matches BookingWidget's
      // own client-side preview/quote calls exactly (see that file's
      // note), so the price the customer saw and the price actually
      // charged here can never disagree over which leg carries it.
      hasStopover: input.hasStopover,
    });

    // A return leg is priced by calling the exact same engine a second
    // time with pickup/destination swapped (and the coordinates swapped
    // to match) — not a separate formula. Falls back the same way if
    // Google Routes is unavailable for this second call.
    const returnQuote = input.returnTrip
      ? await computeQuoteWithRoute({
          pickup: input.returnPickup || input.destination,
          destination: input.returnDestination || input.pickup,
          vehicleType: input.vehicleType,
          pickupLat: input.destinationLat,
          pickupLng: input.destinationLng,
          destinationLat: input.pickupLat,
          destinationLng: input.pickupLng,
        })
      : null;

    const totalPrice = quote.totalPrice + (returnQuote?.totalPrice ?? 0);

    // The Booking table has no dedicated stopover column — adding one
    // needs a database migration, which this environment's sandbox
    // blocks running against the live production database without the
    // client's own direct action (see the session's own notes on this).
    // Folding the stopover address into the existing free-text `notes`
    // field instead is a deliberate, safe workaround: real, visible
    // operational information for the driver with zero schema change
    // and zero migration risk. Prepended (not appended) so it's the
    // first thing a driver reading the booking notices, and kept out of
    // the stored `notes` fully when there's no stopover, so an existing
    // booking's notes are byte-for-byte unchanged.
    const notesWithStopover = input.hasStopover && input.stopover
      ? `Tussenstop: ${input.stopover}${input.notes ? `\n\n${input.notes}` : ""}`
      : input.notes;

    const localeHeader = request.headers.get("x-locale");
    const locale = routing.locales.includes(localeHeader as never)
      ? (localeHeader as "nl" | "en")
      : routing.defaultLocale;

    const booking = await prisma.booking.create({
      data: {
        locale,
        rideType: quote.rideType,
        pickupAddress: input.pickup,
        destination: input.destination,
        date: input.date,
        time: input.time,
        passengers: input.passengers,
        luggage: input.luggage,
        vehicleType: input.vehicleType,
        basePrice: quote.basePrice,
        vehicleSurcharge: quote.vehicleSurcharge,
        price: quote.totalPrice,
        priceSource: quote.source,
        distanceKm: quote.distanceKm,
        durationMin: quote.durationMin,
        distanceSource: quote.distanceSource,
        totalPrice,
        returnBasePrice: returnQuote?.basePrice ?? null,
        returnVehicleSurcharge: returnQuote?.vehicleSurcharge ?? null,
        returnPrice: returnQuote?.totalPrice ?? null,
        returnDistanceKm: returnQuote?.distanceKm ?? null,
        returnDurationMin: returnQuote?.durationMin ?? null,
        flightNumber: input.flightNumber || null,
        returnTrip: input.returnTrip,
        returnDate: input.returnDate || null,
        returnTime: input.returnTime || null,
        // v1's UI doesn't collect a separate return address yet — when a
        // customer checks "return trip" we default it to the outbound
        // leg reversed (the common case), while still honoring an
        // explicit value if a future UI ever sends one.
        returnPickup: input.returnTrip ? input.returnPickup || input.destination : null,
        returnDestination: input.returnTrip ? input.returnDestination || input.pickup : null,
        childSeat: input.childSeat,
        notes: notesWithStopover || null,
        customerName: input.name,
        customerPhone: input.phone,
        customerEmail: input.email,
        // paymentStatus defaults to UNPAID (see schema.prisma) — v1 has no
        // online payment, the customer pays the driver after the ride.
      },
    });

    // Fire-and-forget: the booking is already safely stored, so a slow or
    // failing email provider shouldn't delay or fail this response.
    void sendBookingEmails(booking, locale);

    return NextResponse.json({
      // The friendly "AMS-DDMMYY-XXXX" reference, not the raw database
      // id — this is what the customer sees, says over the phone, and
      // gets emailed. See lib/bookingReference.ts.
      bookingId: bookingReference(booking),
      quote,
      returnQuote,
      totalPrice,
      // Checked synchronously (no need to await the actual send) so the
      // confirmation screen can honestly say whether an email was even
      // attempted — see ConfirmationCard's emailConfirmed handling.
      emailConfigured: isEmailConfigured(),
    });
  } catch (error) {
    // Never let a DB/network failure (e.g. an unreachable Postgres
    // instance, a bad connection string) bubble up as a bare framework
    // 500 — log the real cause server-side only, and return a generic,
    // safe JSON error so the client's submitError copy can render
    // instead of a JSON-parse crash on an empty body.
    console.error("[bookings] Failed to create booking:", error);
    return NextResponse.json({ error: "booking_failed" }, { status: 503 });
  }
}
