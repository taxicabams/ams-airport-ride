import { NextResponse } from "next/server";
import { placesProvider, PlacesNotConfiguredError } from "@/lib/places";
import { placesDetailsInputSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Fires once per address selection (not per keystroke), so a much lower
// ceiling than autocomplete is still generous for real usage.
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(
    `places-details:${getClientIp(request)}`,
    RATE_LIMIT
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = placesDetailsInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { placeId, sessionToken } = parsed.data;

  try {
    const place = await placesProvider.getDetails(placeId, sessionToken);
    return NextResponse.json({ place });
  } catch (error) {
    if (error instanceof PlacesNotConfiguredError) {
      return NextResponse.json({ error: "places_not_configured" }, { status: 503 });
    }
    console.error("[places] details failed:", error);
    return NextResponse.json({ error: "places_unavailable" }, { status: 502 });
  }
}
