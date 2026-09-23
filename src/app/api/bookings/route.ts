import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateQuote } from "@/lib/pricing";
import { bookingInputSchema } from "@/lib/validation";
import { sendBookingEmails } from "@/lib/email";
import { routing } from "@/i18n/routing";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const input = parsed.data;

  // Always recompute the price from scratch on the server — the price a
  // client sent along with the form could have been edited in devtools,
  // so the number we actually charge/store must never come from the
  // request body.
  const quote = calculateQuote({
    pickup: input.pickup,
    destination: input.destination,
    vehicleType: input.vehicleType,
  });

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
      flightNumber: input.flightNumber || null,
      returnTrip: input.returnTrip,
      returnDate: input.returnDate || null,
      returnTime: input.returnTime || null,
      childSeat: input.childSeat,
      notes: input.notes || null,
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

  return NextResponse.json({ bookingId: booking.id, quote });
}
