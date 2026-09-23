import type routing from "@/i18n/routing";
import type messages from "../messages/nl.json";

// Gives next-intl's useTranslations()/getTranslations() full autocomplete
// and type-checking against our actual message keys, and restricts the
// locale type to exactly "nl" | "en" everywhere in the app.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
