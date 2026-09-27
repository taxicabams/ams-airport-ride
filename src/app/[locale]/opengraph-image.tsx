import { ImageResponse } from "next/og";

/**
 * Recolored for the "Schiphol-inspired" blue identity (see globals.css's
 * own header note for where these exact colors come from — sampled from
 * schiphol.nl, not guessed, and not a copy of Schiphol's own logo).
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
          backgroundColor: "#22323a",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          <svg width="72" height="72" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="10" fill="#2670c7" />
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
        <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "#5b9ce8", fontWeight: 700 }}>
          {isNl ? "Op tijd. Vaste prijs." : "On time. Fixed price."}
        </div>
        <div style={{ display: "flex", fontSize: 24, marginTop: 16, color: "#a8bac4" }}>
          {isNl ? "Vaste prijs vanaf €35 · 24/7 bereikbaar" : "Fixed price from €35 · Available 24/7"}
        </div>
      </div>
    ),
    { ...size }
  );
}
