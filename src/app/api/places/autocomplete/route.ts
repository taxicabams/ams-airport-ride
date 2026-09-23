import { NextResponse } from "next/server";
import { placesProvider, PlacesNotConfiguredError } from "@/lib/places";
import { placesAutocompleteInputSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Keystroke-debounced on the client (~300ms), so normal typing is well
// under this — this only stops a script bypassing the debounce and
// hammering an endpoint that bills per request against our Google Cloud
// project.
const RATE_LIMIT = { limit: 40, windowMs: 60_000 };

export async function POST(request: Request) {
  const { allowed, retryAfterSeconds } = checkRateLimit(
    `places-autocomplete:${getClientIp(request)}`,
    RATE_LIMIT
  );
  if (!allowed) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = placesAutocompleteInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const { input, sessionToken, locale } = parsed.data;

  try {
    const suggestions = await placesProvider.autocomplete(input, sessionToken, locale);
    return NextResponse.json({ suggestions });
  } catch (error) {
    if (error instanceof PlacesNotConfiguredError) {
      // Distinct from "zero results" — the client shows a different
      // message ("address lookup unavailable" vs. "no matches").
      return NextResponse.json({ error: "places_not_configured" }, { status: 503 });
    }
    console.error("[places] autocomplete failed:", error);
    return NextResponse.json({ error: "places_unavailable" }, { status: 502 });
  }
}
