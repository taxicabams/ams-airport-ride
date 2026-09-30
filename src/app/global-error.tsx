"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * The one true last-resort error boundary for the whole app. Next.js
 * requires global-error.tsx to define its own complete <html>/<body> —
 * it only ever renders when the ROOT layout itself throws (extremely
 * rare: a bug in [locale]/layout.tsx, boek-taxi-schiphol/layout.tsx, or
 * en/boek-taxi-schiphol/layout.tsx before they can render their own
 * children), which means the very providers that would normally give us
 * a locale (next-intl's NextIntlClientProvider lives inside those
 * layouts) are unavailable here — this file cannot assume a locale.
 * Deliberately self-contained: no next-intl, no other app import beyond
 * the global stylesheet, hardcoded short NL+EN text stacked together so
 * a visitor in either language still understands it. Same rule as
 * error.tsx: log the real error to the console for debugging, never
 * show it to the customer.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <html lang="nl">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#faf9f7",
          color: "#1a1a1a",
        }}
      >
        <div>
          <p style={{ fontWeight: 700, fontSize: "1.25rem" }}>Er ging iets mis</p>
          <p style={{ marginTop: "0.5rem", color: "#555" }}>
            Deze pagina kon niet geladen worden. Probeer het opnieuw of ga terug naar de homepage.
          </p>
        </div>
        <div style={{ borderTop: "1px solid #ddd", paddingTop: "1rem", width: "100%", maxWidth: "28rem" }}>
          <p style={{ fontWeight: 700, fontSize: "1.25rem" }}>Something went wrong</p>
          <p style={{ marginTop: "0.5rem", color: "#555" }}>
            This page couldn&apos;t load. Try again or go back to the homepage.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            type="button"
            onClick={reset}
            style={{
              borderRadius: "999px",
              padding: "0.75rem 1.25rem",
              fontWeight: 600,
              background: "#f5a623",
              color: "#1a1a1a",
              border: "none",
              cursor: "pointer",
            }}
          >
            Probeer opnieuw / Try again
          </button>
          {/* Plain <a>, not next/link's Link, is deliberate here: this
              file replaces the root layout itself, so the router
              context Link depends on may not be safe to assume — a
              full page reload is the one thing guaranteed to work. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              borderRadius: "999px",
              padding: "0.75rem 1.25rem",
              fontWeight: 600,
              border: "1px solid #ccc",
              color: "#1a1a1a",
              textDecoration: "none",
            }}
          >
            ← Home
          </a>
        </div>
      </body>
    </html>
  );
}
