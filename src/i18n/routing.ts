import { defineRouting } from "next-intl/routing";

/**
 * Locale configuration, single source of truth shared by the proxy,
 * navigation helpers, and request config below.
 *
 * `localePrefix: "as-needed"` means the default locale (Dutch) has NO
 * URL prefix — so SEO target URLs like /taxi-schiphol-amsterdam stay
 * exact instead of becoming /nl/taxi-schiphol-amsterdam. English lives
 * under /en/... . Adding a locale later (de, es, it, fr) is a one-line
 * change here.
 */
export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  localePrefix: "as-needed",
  // Real bug found live in the QA sprint: with next-intl's default
  // localeDetection (true), a visitor who once had NEXT_LOCALE=en set
  // (e.g. clicked "EN" once) gets the bare, unprefixed "/" — meant to
  // always serve Dutch, the default locale — 307-redirected to "/en"
  // on every later visit, because the middleware honors the cookie over
  // the URL. Confirmed with a clean curl cookie jar: GET /en (sets
  // NEXT_LOCALE=en) then GET / → 307 Location: /en. Disabling detection
  // makes the path the only source of truth: "/" is always Dutch, "/en"
  // is always English, exactly matching this site's own locale-prefix
  // design. The manual NL/EN switcher is unaffected — it navigates via
  // next-intl's own Link/useRouter, which use the current pathname, not
  // this cookie, to build the target URL.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
