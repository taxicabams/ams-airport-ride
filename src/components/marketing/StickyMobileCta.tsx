"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { companyInfo } from "@/lib/companyInfo";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

const FOCUSABLE_SELECTOR = "input, textarea, select";

/**
 * "Vertrekbord" rebuild — 3 buttons per the brief's exact mobile spec:
 * Bellen (tel:) / WhatsApp (wa.me, green) / Boek nu (amber). Call and
 * WhatsApp only render while their companyInfo field is set (same
 * null-until-real safety convention used everywhere else) — today
 * that's the client's own "1234567"-style preview values, see
 * companyInfo.ts. Still hidden entirely while a form field has focus
 * (the real on-screen-keyboard-overlap bug fixed earlier this project —
 * see the git history for the repro).
 */
export function StickyMobileCta() {
  const t = useTranslations("StickyCta");
  const tb = useTranslations("Booking");
  const [fieldFocused, setFieldFocused] = useState(false);

  useEffect(() => {
    const isFormField = (target: EventTarget | null) =>
      target instanceof Element && target.matches(FOCUSABLE_SELECTOR);

    const handleFocusIn = (e: FocusEvent) => {
      if (isFormField(e.target)) setFieldFocused(true);
    };
    const handleFocusOut = (e: FocusEvent) => {
      if (isFormField(e.target)) setFieldFocused(false);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  if (fieldFocused) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-ink-2 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-3 gap-px bg-white/10">
        {companyInfo.phone && (
          <a
            href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 bg-ink-2 py-2 text-[11px] font-semibold text-white"
          >
            <PhoneIcon className="h-4 w-4" />
            {t("call")}
          </a>
        )}
        {companyInfo.whatsapp && (
          <a
            href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(tb("whatsappPrefill"))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 bg-ink-2 py-2 text-[11px] font-semibold text-whatsapp"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t("whatsapp")}
          </a>
        )}
        <Link
          href="/#boeken"
          className="flex min-h-[44px] flex-col items-center justify-center gap-0.5 bg-brand py-2 text-[11px] font-bold text-brand-foreground"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
