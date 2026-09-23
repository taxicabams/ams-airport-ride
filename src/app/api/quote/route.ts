import { NextResponse } from "next/server";
import { computeQuoteWithRoute } from "@/lib/computeQuote";
import { quoteInputSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Fired on every step-2→3 transition (twice for a return trip), plus a
// manual retry — generous enough for real use, tight enough to blunt a
// script hammering the endpoint (each call can trigger a billed Google
// Routes request).
const RATE_LIMIT = { limit: 30, windowMs: 60_000 };

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(`quote:${getClientIp(request)}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = quoteInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  try {
    const quote = await computeQuoteWithRoute(parsed.data);
    return NextResponse.json({ quote });
  } catch (error) {
    // computeQuoteWithRoute already falls back to an estimate on its own
    // when Google Routes is unavailable (see lib/computeQuote.ts) — this
    // only guards against a genuinely unexpected failure, so it never
    // reaches the client as a bare framework 500.
    console.error("[quote] Failed to compute quote:", error);
    return NextResponse.json({ error: "quote_failed" }, { status: 503 });
  }
}
