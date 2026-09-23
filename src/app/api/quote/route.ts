import { NextResponse } from "next/server";
import { computeQuoteWithRoute } from "@/lib/computeQuote";
import { quoteInputSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = quoteInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  const quote = await computeQuoteWithRoute(parsed.data);
  return NextResponse.json({ quote });
}
