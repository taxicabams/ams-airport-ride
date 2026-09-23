import { NextResponse } from "next/server";
import { placesProvider, PlacesNotConfiguredError } from "@/lib/places";
import { placesAutocompleteInputSchema } from "@/lib/validation";

export async function POST(request: Request) {
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
