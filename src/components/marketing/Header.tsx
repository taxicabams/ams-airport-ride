import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { Logo } from "@/components/ui/Logo";

export async function Header() {
  const t = await getTranslations("Nav");

  // Taxi Schiphol / Taxi Amsterdam / Prijzen all point into the
  // homepage's own sections (no separate pages to keep in sync — the
  // calculator, price examples and route grid already live there)
  // rather than duplicating that content on new routes. Shared between
  // the desktop nav below and MobileNav so the two can never drift.
  const navItems = [
    { href: "/", label: t("taxiSchiphol") },
    { href: "/#amsterdam-taxi", label: t("taxiAmsterdam") },
    { href: "/#prijzen", label: t("prices") },
    { href: "/veelgestelde-vragen", label: t("faq") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/80 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <Link
            href="/#boeken"
            className="hidden rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95 md:inline-block"
          >
            {t("bookNow")}
          </Link>
          <MobileNav
            items={navItems}
            bookLabel={t("bookNow")}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
          />
        </div>
      </div>
    </header>
  );
}
