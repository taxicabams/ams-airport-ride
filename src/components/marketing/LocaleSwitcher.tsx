"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, { short: string; full: string }> = {
  nl: { short: "NL", full: "Nederlands" },
  en: { short: "EN", full: "English" },
};

/**
 * Redesigned per explicit feedback ("nederlands engels moet op een
 * andere manier, kan betere manier") — was two always-visible pills
 * side by side; now a single compact "NL ▾" control that opens a small
 * menu naming both languages in full. Also moved out of TopBar (which
 * is `hidden md:block`) into Header itself, so it's reachable on mobile
 * too — TopBar-only placement meant phone visitors had no way at all to
 * switch language, a real gap fixed here.
 */
export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-9 items-center gap-1 rounded-full px-2.5 text-sm font-semibold text-white/75 transition hover:text-white"
      >
        {LABELS[locale].short}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-1 w-36 overflow-hidden rounded-[10px] border border-border bg-surface py-1 shadow-elevated"
        >
          {routing.locales.map((loc) => (
            <li key={loc}>
              <button
                type="button"
                role="option"
                aria-selected={loc === locale}
                onClick={() => {
                  setOpen(false);
                  router.replace(pathname, { locale: loc });
                }}
                className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-sm transition hover:bg-muted-background ${
                  loc === locale ? "font-semibold text-brand-text" : "text-foreground"
                }`}
              >
                {LABELS[loc].full}
                <span className="font-mono text-xs text-muted">{LABELS[loc].short}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
