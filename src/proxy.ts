import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

/**
 * Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` (same
 * mechanism, run on every matched request before rendering). next-intl's
 * `createMiddleware` still returns a plain request handler, so it works
 * unchanged under the new file name — we just export it as `proxy`.
 */
export const proxy = createMiddleware(routing);

export const config = {
  // Run on every path except static assets, Next internals, and files
  // with an extension (images, etc.) — those don't need locale handling.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
