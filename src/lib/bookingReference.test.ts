import { describe, expect, it } from "vitest";
import { bookingReference } from "./bookingReference";

describe("bookingReference", () => {
  it("formats as AMS-DDMMYY-XXXX using the booking's createdAt date", () => {
    const ref = bookingReference({ id: "abc123", createdAt: new Date(2026, 8, 26) }); // 26 Sep 2026
    expect(ref).toMatch(/^AMS-260926-\d{4}$/);
  });

  it("is deterministic — the same id + date always produces the same reference", () => {
    const createdAt = new Date(2026, 8, 26);
    const first = bookingReference({ id: "clh3k2j9x0000qzrm", createdAt });
    const second = bookingReference({ id: "clh3k2j9x0000qzrm", createdAt });
    expect(first).toBe(second);
  });

  it("differs for different ids on the same day (not a constant suffix)", () => {
    const createdAt = new Date(2026, 8, 26);
    const a = bookingReference({ id: "booking-one", createdAt });
    const b = bookingReference({ id: "booking-two", createdAt });
    expect(a).not.toBe(b);
  });

  it("pads single-digit day/month", () => {
    const ref = bookingReference({ id: "x", createdAt: new Date(2026, 0, 5) }); // 5 Jan 2026
    expect(ref.startsWith("AMS-0501")).toBe(true);
  });
});
