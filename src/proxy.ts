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
const WWW_HOST = "www.amsairportride.nl";
const APEX_HOST = "amsairportride.nl";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Real SEO bug found live: both https://amsairportride.nl AND
  // https://www.amsairportride.nl serve identical 200 content with NO
  // redirect between them — confirmed via curl (DNS puts both hostnames
  // on the same CDN/origin, so this app's own middleware sees both).
  // That's duplicate content at the domain level, and it's exactly why
  // Lighthouse's canonical audit failed on the live site: the page's own
  // <link rel="canonical"> (and sitemap.xml, and OG tags) all already
  // point at the apex host (no "www"), so a visit arriving via "www"
  // rendered a canonical that disagreed with the URL actually in the
  // address bar. Redirect "www" -> apex, permanently, before anything
  // else runs, so only one host is ever indexable and canonical/hreflang
  // always matches the URL the visitor (and Google) actually see.
  const host = request.headers.get("host");
  if (host === WWW_HOST) {
    const url = request.nextUrl.clone();
    // Real bug caught in local testing: `url.host = APEX_HOST` alone left
    // a stray ":3000" (the dev server's own port) in the redirect's
    // Location header — NextURL's `.host` setter doesn't reliably clear
    // an existing port the way the WHATWG URL spec would. Setting
    // `.hostname` and `.port` separately is unambiguous in every
    // environment, including production, where an internal proxy port
    // could just as easily leak through unnoticed.
    url.hostname = APEX_HOST;
    url.port = "";
    url.protocol = "https";
    return NextResponse.redirect(url, 308);
  }

  // Real bug found live: the Ads landing page (src/app/boek-taxi-schiphol,
  // deliberately its own root route OUTSIDE the [locale] segment — see
  // that route's own layout.tsx note) was 404ing. next-intl's own
  // middleware, matched against every non-file path, was rewriting this
  // unprefixed path to "/nl/boek-taxi-schiphol" internally (confirmed via
  // the response's own x-middleware-rewrite header) — a route that
  // genuinely doesn't exist, since this page was built to bypass i18n
  // routing entirely. Skip the i18n middleware for this one path so
  // Next's own file-based routing finds the real route directly. Same
  // bypass for the English sibling at src/app/en/boek-taxi-schiphol.
  if (pathname === "/boek-taxi-schiphol" || pathname === "/en/boek-taxi-schiphol") {
    return NextResponse.next();
  }

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
