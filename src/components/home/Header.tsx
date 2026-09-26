import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { MobileNav } from "@/components/marketing/MobileNav";
import { Logo } from "@/components/ui/Logo";
import { companyInfo } from "@/lib/companyInfo";
import { PhoneIcon } from "@/components/ui/icons";

/**
 * v10 rebuild — permanently dark-navy header bar (bg-ink), not
 * theme-following like v9's `bg-surface/95`. Per the client's mockup:
 * white logo/nav on navy, one gold CTA pill, in both light and dark
 * site themes — a premium airline/travel-brand top bar, not a
 * light-mode-switching one. Nav labels/links unchanged in logic.
 *
 * The phone link below renders only once companyInfo.phone is real
 * (still `null` today) — wired now so a confirmed number appears,
 * tap-to-call, on every page the instant it's added, with zero further
 * code changes. Never a placeholder number.
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-ink-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo variant="dark" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/75 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {companyInfo.phone && (
            <a
              href={`tel:${companyInfo.phone}`}
              className="hidden items-center gap-1.5 text-sm font-medium text-white/75 transition hover:text-white lg:inline-flex"
            >
              <PhoneIcon className="h-4 w-4" />
              {companyInfo.phone}
            </a>
          )}
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
