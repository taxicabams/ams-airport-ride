import { ImageResponse } from "next/og";

/**
 * Rebuilt for the "vertrekbord" identity — the previous version was
 * badly stale (a leftover pre-Layout-4.0 blue, and a generic "A" badge
 * instead of the real logo mark). Per direct feedback ("als je zoekt
 * moet er een logo komen bij website zoekbalk als je al die website
 * preview ziet") — this OG image is exactly what a search engine or a
 * WhatsApp/social link preview shows, so it now uses the *real* logo
 * mark (the same path data as LogoMark.tsx, inlined here since next/og
 * can't import a React component that renders a plain <svg>, only plain
 * flex/text nodes plus raw SVG elements) and the current navy/amber
 * palette + real hero copy.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isNl = locale === "nl";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0f1a2b",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          <svg width="72" height="72" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="10" fill="#f5a524" />
            <path
              d="M9 30 Q16 13, 30 9"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="9" cy="30" r="2.8" fill="#ffffff" />
            <path d="M30 9 36.5 4.5 32 13.5 28.5 12Z" fill="#ffffff" />
          </svg>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>AMS AIRPORT RIDE</div>
        </div>
        <div style={{ display: "flex", fontSize: 58, fontWeight: 800, lineHeight: 1.15, maxWidth: 920 }}>
          {isNl ? "Taxi naar Schiphol." : "Taxi to Schiphol."}
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "#f5a524", fontWeight: 700 }}>
          {isNl ? "Op tijd. Vaste prijs." : "On time. Fixed price."}
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 16, color: "#b9c4d6" }}>
          {isNl ? "Vaste prijs vanaf €35 · 24/7 bereikbaar" : "Fixed price from €35 · Available 24/7"}
        </div>
      </div>
    ),
    { ...size }
  );
}
