import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";

export async function Header() {
  const t = await getTranslations("Nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-brand">
          <span className="text-lg">AMS Airport Ride</span>
        </Link>

        {/* Taxi Schiphol / Taxi Amsterdam / Prijzen all point into the
            homepage's own sections (no separate pages to keep in sync —
            the calculator, price examples and route grid already live
            there) rather than duplicating that content on new routes. */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/80 md:flex">
          <Link href="/" className="hover:text-brand">
            {t("taxiSchiphol")}
          </Link>
          <Link href="/#amsterdam-taxi" className="hover:text-brand">
            {t("taxiAmsterdam")}
          </Link>
          <Link href="/#prijzen" className="hover:text-brand">
            {t("prices")}
          </Link>
          <Link href="/veelgestelde-vragen" className="hover:text-brand">
            {t("faq")}
          </Link>
          <Link href="/contact" className="hover:text-brand">
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <Link
            href="/#boeken"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
          >
            {t("bookNow")}
          </Link>
        </div>
      </div>
    </header>
  );
}
