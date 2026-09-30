"use client";

import { COOKIE_SETTINGS_REOPEN_EVENT } from "./CookieConsentBanner";

/**
 * "Cookie-instellingen" footer link — lets a visitor who already made a
 * choice (accept/reject) reopen the banner and change their mind, per
 * the requirement that consent must be as easy to withdraw as to give.
 * Dispatches a plain DOM event rather than lifting state up through the
 * server-rendered Footer, since the banner and this link don't
 * otherwise share a client-side parent.
 */
export function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(COOKIE_SETTINGS_REOPEN_EVENT))}
      className="text-left hover:text-white"
    >
      {label}
    </button>
  );
}
