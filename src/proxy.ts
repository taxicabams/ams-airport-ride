import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (same
 * mechanism, run on every matched request before rendering). next-intl's
 * `createMiddleware` still returns a plain request handler, so it works
 * unchanged under the new file name — we just export it as `proxy`.
 */
const intlMiddleware = createMiddleware(routing);

/**
 * Dutch is the default locale with no URL prefix (see routing.ts), so
 * "/nl" itself isn't a real page. next-intl's own handling of that case
 * is a two-hop redirect: it 307s "/nl" to "/" and sets a fresh
 * NEXT_LOCALE=nl cookie, then the follow-up request to "/" re-reads
 * whatever NEXT_LOCALE cookie is present to pick the locale. If a STALE
 * NEXT_LOCALE=en cookie already exists from an earlier visit and doesn't
 * get overwritten in time (browser cookie timing, an intermediate CDN),
 * that second hop can end up honoring the old cookie instead of the
 * visitor's explicit "/nl" intent, landing on "/en" — the reported bug.
 *
 * Fix: handle "/nl" (and "/nl/...") ourselves, one hop, before next-intl
 * ever runs — redirect straight to the un-prefixed path AND set
 * NEXT_LOCALE=nl on that same response. There's no second hop left to
 * race a stale cookie against, and the canonical URL structure (Dutch at
 * bare paths, no "/nl/..." prefix) is unchanged.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/nl" || pathname.startsWith("/nl/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/nl" ? "/" : pathname.slice("/nl".length);
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", "nl", { path: "/" });
    return response;
  }

  return intlMiddleware(request);
}

export const config = {
  // Run on every path except static assets, Next internals, and files
  // with an extension (images, etc.) — those don't need locale handling.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
