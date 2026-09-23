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
          className={
            loc === locale
              ? "rounded-full bg-brand px-2.5 py-1 text-brand-foreground"
              : "rounded-full px-2.5 py-1 text-muted hover:text-foreground"
          }
        >
          {LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
