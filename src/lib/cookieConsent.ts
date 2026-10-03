/**
 * Cookie consent state — the shared, universally-safe half (constant +
 * type). Deliberately has NO import of "next/headers": this file is
 * imported by CookieConsentBanner.tsx, a Client Component, and pulling
 * a server-only API into that import chain fails the client bundle
 * entirely ("next/headers ... only available in Server Components").
 * The actual cookie READ (which does need next/headers) lives in
 * cookieConsent.server.ts instead — Analytics.tsx (a Server Component)
 * imports from there.
 *
 * Stored client-side as a plain, non-HttpOnly cookie
 * (CookieConsentBanner.tsx sets it directly via document.cookie) so
 * both a Server Component (deciding whether to render the GTM/GA4
 * <Script> tags at all) and client code (the banner itself, deciding
 * whether to show) can read the same value without a round trip. 1 year
 * expiry, SameSite=Lax — this is itself a strictly necessary cookie (it
 * stores the user's own privacy choice), so it needs no consent of its
 * own.
 */
export const CONSENT_COOKIE_NAME = "ams_consent";
export type ConsentValue = "accepted" | "rejected";

/**
 * Fired on `window` right after CookieConsentBanner.tsx writes a new
 * decision to the cookie — Analytics.tsx (now a Client Component, see
 * its own note on why) listens for this to re-check consent immediately
 * without waiting for a full navigation/refresh.
 */
export const CONSENT_CHANGED_EVENT = "ams:consent-changed";

/**
 * Reads the consent cookie directly via `document.cookie` — browser-only
 * (throws nothing, just returns null, if called during SSR where
 * `document` doesn't exist yet). Shared by CookieConsentBanner.tsx and
 * Analytics.tsx so both parse the exact same cookie the exact same way.
 */
export function readConsentCookie(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return value === "accepted" || value === "rejected" ? value : null;
}
