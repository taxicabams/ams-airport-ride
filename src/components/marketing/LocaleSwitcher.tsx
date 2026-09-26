"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { nl: "NL", en: "EN" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1 text-sm font-medium">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          aria-current={loc === locale}
          onClick={() => router.replace(pathname, { locale: loc })}
          className={[
            // min-h-9 matches the app's small-control touch-target
            // convention (Stepper, SegmentedControl) — the previous
            // py-1-only sizing measured ~28px tall, under the
            // recommended ~40-44px minimum for a mobile tap target.
            // Only ever rendered inside the (permanently dark-navy)
            // Header, so the inactive state is tuned for a dark
            // background, not the light-surface --muted/--foreground
            // pair used elsewhere.
            "flex min-h-9 min-w-9 items-center justify-center rounded-full px-2.5",
            loc === locale
              ? "bg-brand text-brand-foreground"
              : "text-white/60 hover:text-white",
          ].join(" ")}
        >
          {LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
