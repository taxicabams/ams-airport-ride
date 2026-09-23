import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { checkRateLimit, getClientIp, _resetRateLimitStateForTests } from "./rateLimit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    _resetRateLimitStateForTests();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests up to the limit within the window", () => {
    const opts = { limit: 3, windowMs: 60_000 };
    expect(checkRateLimit("key-a", opts).allowed).toBe(true);
    expect(checkRateLimit("key-a", opts).allowed).toBe(true);
    expect(checkRateLimit("key-a", opts).allowed).toBe(true);
  });

  it("blocks once the limit is exceeded within the same window", () => {
    const opts = { limit: 2, windowMs: 60_000 };
    expect(checkRateLimit("key-b", opts).allowed).toBe(true);
    expect(checkRateLimit("key-b", opts).allowed).toBe(true);
    const third = checkRateLimit("key-b", opts);
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("keeps separate buckets per key", () => {
    const opts = { limit: 1, windowMs: 60_000 };
    expect(checkRateLimit("key-c1", opts).allowed).toBe(true);
    // A different key must not be affected by key-c1's bucket.
    expect(checkRateLimit("key-c2", opts).allowed).toBe(true);
    expect(checkRateLimit("key-c1", opts).allowed).toBe(false);
  });

  it("resets the bucket once the window has elapsed", () => {
    vi.useFakeTimers();
    const opts = { limit: 1, windowMs: 1000 };
    expect(checkRateLimit("key-d", opts).allowed).toBe(true);
    expect(checkRateLimit("key-d", opts).allowed).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(checkRateLimit("key-d", opts).allowed).toBe(true);
  });
});

describe("getClientIp", () => {
  it("reads the first address from x-forwarded-for", () => {
    const request = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "203.0.113.5, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.5");
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", () => {
    const request = new Request("http://localhost/api/test", {
      headers: { "x-real-ip": "198.51.100.9" },
    });
    expect(getClientIp(request)).toBe("198.51.100.9");
  });

  it("falls back to a constant when neither header is present", () => {
    const request = new Request("http://localhost/api/test");
    expect(getClientIp(request)).toBe("unknown");
  });
});
