"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const FOCUSABLE_SELECTOR = "input, textarea, select";

/**
 * Mobile-only bottom bar keeping the primary CTA reachable while
 * scrolling (the brief's explicit "sticky mobile CTA" requirement) —
 * desktop already has the header's own "Book now" button always in
 * view, so this is `md:hidden`. `pb-[env(safe-area-inset-bottom)]`
 * keeps it clear of the home-indicator area on notched phones; the
 * layout adds matching bottom padding to <main> so this bar never
 * covers the last bit of page content (see layout.tsx).
 *
 * Client component so it can hide itself while any form field has
 * focus. Confirmed root cause of a real booking bug ("Confirm booking
 * sometimes not clickable"): on a shrunk mobile viewport (e.g. the
 * on-screen keyboard open while filling in the booking form's contact
 * step), this bar's own fixed-positioned rect can geometrically
 * overlap the booking flow's real submit button, so a tap there hits
 * this bar instead — reproduced and measured via
 * `document.elementFromPoint()` at a reduced viewport height, which
 * resolved to this bar rather than the button. Hiding the bar exactly
 * while a field is focused (the same moment the keyboard is open and
 * the collision becomes possible) removes the overlap entirely, and is
 * also the moment a second, redundant "Book" CTA floating over the
 * form is actively unhelpful anyway.
 */
export function StickyMobileCta() {
  const t = useTranslations("StickyCta");
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
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <p className="text-sm font-semibold text-foreground">{t("label")}</p>
        <Link
          href="/#boeken"
          className="shrink-0 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
        >
          {t("cta")}
        </Link>
      </div>
    </div>
  );
}
