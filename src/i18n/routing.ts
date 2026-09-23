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
});

export type AppLocale = (typeof routing.locales)[number];
