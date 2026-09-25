import { ImageResponse } from "next/og";

/**
 * No OG image existed before this — a link shared on WhatsApp/social
 * would show no preview image at all. Generated at build/request time
 * with next/og (Satori under the hood, so only simple flex/text nodes —
 * no raw SVG paths like the real logo uses), matching the brand's navy/
 * amber palette. Real asset, not a stock photo.
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
          backgroundColor: "#0b3d59",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 48 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
              color: "#0b3d59",
            }}
          >
            A
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>AMS AIRPORT RIDE</div>
        </div>
        <div style={{ display: "flex", fontSize: 58, fontWeight: 800, lineHeight: 1.15, maxWidth: 920 }}>
          {isNl ? "Taxi van en naar Schiphol" : "Taxi to and from Schiphol"}
        </div>
        <div style={{ display: "flex", fontSize: 30, marginTop: 28, color: "#9fd3ea" }}>
          {isNl ? "Vaste prijs vanaf €35 · Deur-tot-deur" : "Fixed price from €35 · Door-to-door"}
        </div>
      </div>
    ),
    { ...size }
  );
}
