import { describe, expect, it } from "vitest";
import { bookingReference } from "./bookingReference";

describe("bookingReference", () => {
  it("formats as AMS-XXXX", () => {
    const ref = bookingReference({ id: "abc123", createdAt: new Date(2026, 8, 26) });
    expect(ref).toMatch(/^AMS-\d{4}$/);
  });

  it("is deterministic — the same id always produces the same reference", () => {
    const createdAt = new Date(2026, 8, 26);
    const first = bookingReference({ id: "clh3k2j9x0000qzrm", createdAt });
    const second = bookingReference({ id: "clh3k2j9x0000qzrm", createdAt });
    expect(first).toBe(second);
  });

  it("differs for different ids (not a constant suffix)", () => {
    const createdAt = new Date(2026, 8, 26);
    const a = bookingReference({ id: "booking-one", createdAt });
    const b = bookingReference({ id: "booking-two", createdAt });
    expect(a).not.toBe(b);
  });

  it("is unaffected by createdAt (kept only for call-site compatibility)", () => {
    const a = bookingReference({ id: "same-id", createdAt: new Date(2026, 0, 5) });
    const b = bookingReference({ id: "same-id", createdAt: new Date(2027, 5, 15) });
    expect(a).toBe(b);
  });
});
