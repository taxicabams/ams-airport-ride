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
