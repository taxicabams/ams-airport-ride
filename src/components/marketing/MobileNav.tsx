"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { MenuIcon, CloseIcon, PhoneIcon } from "@/components/ui/icons";
import { companyInfo } from "@/lib/companyInfo";

type NavItem = { href: string; label: string };

/**
 * Rebuilt from scratch after two real, related bugs in the previous
 * dropdown-panel design (client report: "die knop rechts in de hoek...
 * werkt niet, ik heb het al meerdere keren gevraagd" — reported multiple
 * times):
 *
 * 1. The panel used `absolute inset-x-0 top-full` with no positioned
 *    ancestor, so it fell back to the document's initial containing
 *    block and rendered ~800px down the page, off-screen — fixed once
 *    by adding `relative` to this component's own wrapper div.
 * 2. That fix introduced a second, subtler bug: this wrapper is a flex
 *    *item* inside Header's icon-row (`<div className="flex items-center
 *    gap-3">`), so it sizes to its own content — just the ~44px toggle
 *    button — not the page width. Making it `relative` made it the
 *    *nearest* positioned ancestor, so `inset-x-0` resolved against
 *    that ~44px box instead of the full header: the panel rendered
 *    correctly positioned vertically, but squeezed into a narrow
 *    column on the right, not full-width. This is why the toggle kept
 *    "not working" even after the first fix.
 *
 * Both bugs share one root cause: an `absolute` panel's position and
 * width both depend on which ancestor happens to be positioned,
 * something that quietly changes as the surrounding layout evolves.
 * `position: fixed` sidesteps the whole class of bug — it's always
 * relative to the viewport, never to whatever positioned ancestor a
 * flex/grid refactor happens to leave nearest. This is now a real
 * full-screen overlay (its own close button inside, not dependent on
 * the header's toggle remaining reachable underneath it) — the standard,
 * unambiguous mobile-menu pattern every ancestor-position bug above was
 * really just a fragile attempt to avoid building.
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
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-white transition hover:bg-white/10"
      >
        <MenuIcon />
      </button>

      {open && (
        // Fixed to the viewport, full-screen, solid background — always
        // correctly sized and positioned regardless of where this
        // component sits in the surrounding flex/grid layout. z-50 is
        // deliberately above everything else on the page (StickyMobileCta
        // and WhatsAppButton both use z-30).
        <div className="fixed inset-0 z-50 flex flex-col bg-ink text-ink-foreground">
          <div className="flex items-center justify-end px-4 py-3 sm:px-6">
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/10"
            >
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-2 px-6 pb-16">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3.5 text-xl font-semibold transition hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            {companyInfo.phone && (
              <a
                href={`tel:${companyInfo.phone}`}
                className="flex items-center gap-2 rounded-lg px-3 py-3.5 text-xl font-semibold transition hover:bg-white/5"
              >
                <PhoneIcon className="h-5 w-5" />
                {companyInfo.phone}
              </a>
            )}
            <Link
              href="/#boeken"
              onClick={() => setOpen(false)}
              className="mt-4 rounded-full bg-accent px-4 py-4 text-center text-lg font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
            >
              {bookLabel}
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
