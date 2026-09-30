import "server-only";
import { cookies } from "next/headers";
import { CONSENT_COOKIE_NAME, type ConsentValue } from "./cookieConsent";

/**
 * Server-side read of the visitor's consent decision — used by
 * Analytics.tsx to decide, per request, whether GA4/GTM may load at
 * all. Returns null when no decision has been made yet (new visitor,
 * or consent cleared) — Analytics.tsx treats null the same as
 * "rejected" (never load anything before an explicit accept).
 *
 * Split into its own file (see cookieConsent.ts's header) so that
 * next/headers is never accidentally pulled into a Client Component's
 * bundle just for the shared constant/type — the "server-only" package
 * makes that mistake fail loudly at build time instead of silently.
 */
export async function getConsent(): Promise<ConsentValue | null> {
  const store = await cookies();
  const value = store.get(CONSENT_COOKIE_NAME)?.value;
  return value === "accepted" || value === "rejected" ? value : null;
}
