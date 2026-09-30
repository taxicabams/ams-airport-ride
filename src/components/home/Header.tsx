import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { MobileNav } from "@/components/marketing/MobileNav";
import { LocaleSwitcher } from "@/components/marketing/LocaleSwitcher";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { Logo } from "@/components/ui/Logo";
import { companyInfo } from "@/lib/companyInfo";
import { PhoneIcon } from "@/components/ui/icons";

/**
 * "Vertrekbord" identity — permanently solid navy header (no transparent-
 * over-hero behavior from the previous Layout 4.0 pass; this brief's own
 * spec never asks for that, and the hero here has its own two-column
 * layout, not a full-bleed photo the header would sit over). Back to a
 * plain server component since the scroll-driven client logic from the
 * previous design is no longer needed.
 *
 * Nav: Prijzen / Onze auto's / FAQ, all anchored to their homepage
 * section (this brief's "Routes" nav item would point at the exact same
 * section as "Prijzen" in this single-page structure, so it's folded
 * into one link rather than shown twice). "Zakelijk" was removed
 * entirely per direct feedback ("die zakelijk en op rekening hoef ik
 * ook niet"). "Reviews" removed too — a nav link to a section that only
 * ever said "real reviews coming soon" is exactly the kind of
 * half-finished, "coming soon" production content the client's own
 * brief explicitly forbids; the Reviews component/API/DB model stay in
 * the codebase unchanged so real reviews can be wired back in later.
 */
export async function Header() {
  const t = await getTranslations("Nav");

  const navItems = [
    { href: "/#populaire-routes", label: t("prices") },
    { href: "/#onze-autos", label: t("ourCars") },
    { href: "/#faq", label: t("faq") },
  ];

  return (
    // pt-[env(safe-area-inset-top)]: a real mobile screenshot (client-
    // reported "booking op mobiel gaat nog steeds fout") showed the
    // phone's own status bar (clock/signal/battery) visually overlapping
    // this header's logo/tagline text — this component has no fixed/
    // sticky positioning, so in a normal browser tab that should be
    // impossible (the browser always reserves its own chrome above the
    // page). It's a known behavior in some in-app/Custom-Tab browser
    // contexts (e.g. a link opened from WhatsApp, our own primary
    // contact channel) that render edge-to-edge and expect the PAGE to
    // pad for the status bar itself. TopBar.tsx already handles its own
    // case (it's `hidden` below md, so Header is the true first visible
    // element on mobile) — this fix is the top-safe-area counterpart to
    // the bottom-safe-area padding already used on StickyMobileCta.tsx/
    // CookieConsentBanner.tsx/layout.tsx's own pb-24 comment. env()
    // resolves to 0 in a normal browser tab, so this is a no-op there —
    // it only does anything in exactly the edge-to-edge case the
    // screenshot showed.
    <header className="border-b border-white/10 bg-ink pt-[env(safe-area-inset-top,0px)] text-ink-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo variant="dark" tagline="SCHIPHOL · AMSTERDAM · 24/7" />
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/75 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="transition duration-150 hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {companyInfo.phone && (
            <TrackedLink
              event="phone_clicked"
              href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-1.5 font-mono text-sm font-medium text-white/85 transition duration-150 hover:text-white lg:inline-flex"
            >
              <PhoneIcon className="h-4 w-4" />
              {companyInfo.phone}
            </TrackedLink>
          )}
          <LocaleSwitcher />
          <Link
            href="/#boeken"
            className="hidden rounded-[10px] bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground shadow-sm transition duration-150 hover:bg-brand-dark md:inline-block"
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
