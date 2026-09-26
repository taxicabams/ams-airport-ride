import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { MobileNav } from "@/components/marketing/MobileNav";
import { Logo } from "@/components/ui/Logo";

/**
 * v9 rebuild — deliberately minimal: logo, four nav words, locale
 * switch, one CTA. Per the client's own spec ("Geen 8 menu-items"),
 * trimmed to single-word labels (Schiphol / Amsterdam / Hoe het werkt /
 * FAQ) rather than the previous "Schiphol Taxi" / "Amsterdam Taxi" —
 * both still point into the homepage's own sections, no separate pages
 * to keep in sync.
 */
export async function Header() {
  const t = await getTranslations("Nav");

  const navItems = [
    { href: "/#populaire-routes", label: t("taxiSchiphol") },
    { href: "/#amsterdam-taxi", label: t("taxiAmsterdam") },
    { href: "/#hoe-het-werkt", label: t("howItWorks") },
    { href: "/veelgestelde-vragen", label: t("faq") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-foreground/75 md:flex">
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
            className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-dark md:inline-block"
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
