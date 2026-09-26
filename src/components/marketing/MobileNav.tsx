"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { MenuIcon, CloseIcon, PhoneIcon } from "@/components/ui/icons";
import { companyInfo } from "@/lib/companyInfo";

type NavItem = { href: string; label: string };

/**
 * Header.tsx has no mobile nav at all today — the desktop links are just
 * `hidden md:flex`, so a phone visitor gets logo + book button and
 * nothing else. This is the missing mobile equivalent: a small slide-down
 * panel under the sticky header, closing on a link click or a second tap
 * of the toggle. Kept as its own client component so Header itself stays
 * a server component — only this toggle needs interactivity.
 *
 * The tap-to-call row only renders once companyInfo.phone is real — see
 * companyInfo.ts's null-until-real convention.
 */
export function MobileNav({
  items,
  bookLabel,
  openLabel,
  closeLabel,
}: {
  items: NavItem[];
  bookLabel: string;
  openLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-foreground transition hover:bg-muted-background"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-border bg-surface shadow-elevated">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-foreground/90 transition hover:bg-muted-background"
              >
                {item.label}
              </Link>
            ))}
            {companyInfo.phone && (
              <a
                href={`tel:${companyInfo.phone}`}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-base font-medium text-foreground/90 transition hover:bg-muted-background"
              >
                <PhoneIcon className="h-4 w-4" />
                {companyInfo.phone}
              </a>
            )}
            <Link
              href="/#boeken"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
            >
              {bookLabel}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
