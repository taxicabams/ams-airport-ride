import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Booking } from "@/generated/prisma/client";

// Real bug found during a full audit pass: the return-trip booking
// confirmation (customer email) and the internal notification email
// both silently ignored the return leg entirely — no return date/time/
// route, and the price shown was `booking.price` (the OUTBOUND leg
// only), not `booking.totalPrice` (outbound + return). A customer who
// booked a return trip received an email quoting a lower price than
// they'd actually be charged, with no record of their return ride at
// all. This test locks in the fix in email.ts — see that file's own
// notes on customerEmailBody/internalNotificationBody.
//
// Resend is mocked (no real network call, no real API key needed) so
// this test can inspect the exact HTML string sent for each email.
const sendMock = vi.fn().mockResolvedValue({ data: { id: "test" }, error: null });
vi.mock("resend", () => ({
  // Arrow functions can't be `new`-ed, so this needs a real function
  // (or class) for the `new Resend(apiKey)` call in email.ts to work.
  Resend: vi.fn().mockImplementation(function MockResend() {
    return { emails: { send: sendMock } };
  }),
}));

function makeBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    id: "test-id",
    createdAt: new Date("2026-10-15T00:00:00Z"),
    locale: "nl",
    rideType: "AIRPORT_TRANSFER",
    pickupAddress: "Schiphol Airport",
    destination: "Amsterdam Centraal, Stationsplein, Amsterdam",
    date: "2026-10-15",
    time: "12:00",
    passengers: 1,
    luggage: 1,
    vehicleType: "PERSONENAUTO",
    basePrice: 50,
    vehicleSurcharge: 0,
    price: 50,
    priceSource: "fixed",
    distanceKm: 18,
    durationMin: 25,
    distanceSource: "estimate",
    totalPrice: 50,
    returnBasePrice: null,
    returnVehicleSurcharge: null,
    returnPrice: null,
    returnDistanceKm: null,
    returnDurationMin: null,
    flightNumber: null,
    returnTrip: false,
    returnDate: null,
    returnTime: null,
    returnPickup: null,
    returnDestination: null,
    childSeat: false,
    notes: null,
    customerName: "Test Klant",
    customerPhone: "+31612345678",
    customerEmail: "test@example.com",
    status: "NEW",
    paymentStatus: "UNPAID",
    paymentMethod: null,
    ...overrides,
  } as Booking;
}

beforeEach(() => {
  sendMock.mockClear();
  process.env.RESEND_API_KEY = "test-key";
  process.env.COMPANY_NOTIFICATION_EMAIL = "owner@example.com";
});

describe("sendBookingEmails — single trip (no return)", () => {
  it("shows the single price once, with no return-trip section", async () => {
    const { sendBookingEmails } = await import("./email");
    const booking = makeBooking();

    await sendBookingEmails(booking, "nl");

    expect(sendMock).toHaveBeenCalledTimes(2); // customer + internal
    const customerHtml = sendMock.mock.calls[0][0].html as string;
    expect(customerHtml).toContain("€50");
    expect(customerHtml).not.toContain("Retourreis");

    const internalHtml = sendMock.mock.calls[1][0].html as string;
    expect(internalHtml).toContain("€50");
    expect(internalHtml).not.toContain("Retour van");
  });
});

describe("sendBookingEmails — return trip", () => {
  it("shows both legs and the correct grand total, not just the outbound price", async () => {
    const { sendBookingEmails } = await import("./email");
    const booking = makeBooking({
      price: 50,
      returnPrice: 55,
      totalPrice: 105,
      returnTrip: true,
      returnDate: "2026-10-20",
      returnTime: "09:00",
      returnPickup: "Amsterdam Centraal, Stationsplein, Amsterdam",
      returnDestination: "Schiphol Airport",
    });

    await sendBookingEmails(booking, "nl");

    const customerHtml = sendMock.mock.calls[0][0].html as string;
    // The bug: this used to show only €50 (booking.price) as "the"
    // price, with no mention of the return leg anywhere.
    expect(customerHtml).toContain("€105"); // correct grand total
    expect(customerHtml).toContain("€50"); // outbound leg breakdown
    expect(customerHtml).toContain("€55"); // return leg breakdown
    expect(customerHtml).toContain("2026-10-20"); // return date present
    expect(customerHtml).toContain("09:00"); // return time present
    expect(customerHtml).toContain(booking.returnDestination!);

    const internalHtml = sendMock.mock.calls[1][0].html as string;
    expect(internalHtml).toContain("€105");
    expect(internalHtml).toContain("Retour van");
    expect(internalHtml).toContain("2026-10-20");
  });

  it("never shows a bare booking.price total when a return leg exists", async () => {
    const { sendBookingEmails } = await import("./email");
    // A case where outbound and return prices differ enough that
    // silently dropping the return leg would be obviously wrong if this
    // regressed: total must equal price + returnPrice, always.
    const booking = makeBooking({
      price: 35,
      returnPrice: 90,
      totalPrice: 125,
      returnTrip: true,
      returnDate: "2026-11-01",
      returnTime: "18:30",
      returnPickup: "Utrecht Centraal",
      returnDestination: "Schiphol Airport",
    });

    await sendBookingEmails(booking, "en");

    const customerHtml = sendMock.mock.calls[0][0].html as string;
    expect(customerHtml).toContain("€125");
    expect(customerHtml).toContain("Return trip");
  });
});

describe("sendBookingEmails — direction-specific Schiphol pickup text", () => {
  // Real bug found in a production audit: the Schiphol meeting-point
  // block used to be tied to the overall `rideType` flag (true whenever
  // EITHER leg touches Schiphol), always attached to the OUTBOUND leg.
  // That's wrong whenever the outbound leg is actually a DEPARTURE (the
  // driver comes to the customer) and the Schiphol ARRIVAL is the
  // return leg instead — exactly this test's booking. Locks in the
  // per-leg isSchipholPickup fix in email.ts.
  it("shows the Schiphol meeting-point block on the return leg, not the outbound leg, when outbound is a departure", async () => {
    const { sendBookingEmails } = await import("./email");
    const booking = makeBooking({
      pickupAddress: "Amsterdam Centraal, Stationsplein, Amsterdam", // outbound: home -> Schiphol (departure)
      destination: "Schiphol Airport",
      price: 50,
      returnPrice: 50,
      totalPrice: 100,
      returnTrip: true,
      returnDate: "2026-10-20",
      returnTime: "09:00",
      returnPickup: "Schiphol Airport", // return: Schiphol -> home (arrival)
      returnDestination: "Amsterdam Centraal, Stationsplein, Amsterdam",
    });

    await sendBookingEmails(booking, "nl");

    const customerHtml = sendMock.mock.calls[0][0].html as string;
    // The outbound (departure) leg must get the "driver comes to you"
    // copy, never the Schiphol meeting-point text.
    expect(customerHtml).toContain("Uw chauffeur komt naar u toe");
    // The return (arrival) leg must get the real Schiphol meeting-point
    // text, since that's the leg that's actually a Schiphol pickup.
    expect(customerHtml).toContain("Waar vindt u uw chauffeur?");
    // Exactly one Schiphol meeting-point block, not two or zero.
    expect(customerHtml.match(/Waar vindt u uw chauffeur\?/g)).toHaveLength(1);
    expect(customerHtml.match(/Uw chauffeur komt naar u toe/g)).toHaveLength(1);
  });

  it("shows the Schiphol meeting-point block for a plain one-way Schiphol arrival", async () => {
    const { sendBookingEmails } = await import("./email");
    const booking = makeBooking(); // default: pickup = Schiphol Airport, no return

    await sendBookingEmails(booking, "nl");

    const customerHtml = sendMock.mock.calls[0][0].html as string;
    expect(customerHtml).toContain("Waar vindt u uw chauffeur?");
    expect(customerHtml).not.toContain("Uw chauffeur komt naar u toe");
  });

  it("shows the 'driver comes to you' block, not the Schiphol block, for a plain one-way departure", async () => {
    const { sendBookingEmails } = await import("./email");
    const booking = makeBooking({
      pickupAddress: "Utrecht Centraal",
      destination: "Schiphol Airport",
    });

    await sendBookingEmails(booking, "nl");

    const customerHtml = sendMock.mock.calls[0][0].html as string;
    expect(customerHtml).toContain("Uw chauffeur komt naar u toe");
    expect(customerHtml).not.toContain("Waar vindt u uw chauffeur?");
  });
});
