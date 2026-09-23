import { NextResponse } from "next/server";
import { placesProvider, PlacesNotConfiguredError } from "@/lib/places";
import { placesDetailsInputSchema } from "@/lib/validation";

export async function POST(request: Request) {
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
