"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { MobileNav } from "@/components/marketing/MobileNav";
import { Logo } from "@/components/ui/Logo";
import { companyInfo } from "@/lib/companyInfo";
import { PhoneIcon } from "@/components/ui/icons";

/**
 * Layout 4.0 — client-ified (was a plain async server component) so the
 * header can start transparent over the hero photo and pick up a solid
 * --ink background + border once the page scrolls past it, per the
 * brief's explicit "transparant over hero, solide bij scroll" ask. Text
 * stays white in both states on purpose: the transparent state only ever
 * sits over the hero's own dark-scrim photo (never over light page
 * background), so white nav text is legible either way — no separate
 * light-header variant needed.
 *
 * Nav now: Schiphol (routes/price list), Amsterdam, Bestemmingen (same
 * section, its own label — the destinations grid *is* the price list),
 * Over ons, Contact. Also fixes a real, pre-existing bug found in this
 * pass: "Amsterdam" linked to "/#amsterdam-taxi", an anchor that never
 * existed anywhere in the DOM (TwoColumnBanner had no id) — clicking it
 * silently did nothing. Fixed by giving that section the id.
 */
export function Header() {
  const t = useTranslations("Nav");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/#populaire-routes", label: t("taxiSchiphol") },
    { href: "/#amsterdam-taxi", label: t("taxiAmsterdam") },
    { href: "/#populaire-routes", label: t("prices") },
    { href: "/over-ons", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-ink text-ink-foreground"
          : "border-b border-transparent bg-transparent text-ink-foreground"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo variant="dark" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/75 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition duration-150 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {companyInfo.phone && (
            <a
              href={`tel:${companyInfo.phone}`}
              className="hidden items-center gap-1.5 text-sm font-medium text-white/75 transition duration-150 hover:text-white lg:inline-flex"
            >
              <PhoneIcon className="h-4 w-4" />
              {companyInfo.phone}
            </a>
          )}
          <LocaleSwitcher />
          <Link
            href="/#boeken"
            className="hidden rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition duration-150 hover:bg-brand-dark md:inline-block"
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
