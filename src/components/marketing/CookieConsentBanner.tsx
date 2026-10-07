"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CONSENT_COOKIE_NAME, CONSENT_CHANGED_EVENT, readConsentCookie, type ConsentValue } from "@/lib/cookieConsent";

// Same "real-looking ID" check Analytics.tsx uses — kept in sync
// deliberately (see that file) so the banner and the actual script-
// loading decision can never disagree about whether there's anything to
// ask consent for.
const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const hasTrackingConfigured = Boolean(
  (ga4Id && ga4Id.startsWith("G-")) ||
    (googleAdsId && googleAdsId.startsWith("AW-")) ||
    (gtmId && gtmId.startsWith("GTM-"))
);

/** Name matches the event CookieSettingsLink.tsx dispatches. */
const REOPEN_EVENT = "ams:open-cookie-settings";

/**
 * Cookie consent banner — deliberately renders NOTHING at all when
 * NEXT_PUBLIC_GA4_ID/NEXT_PUBLIC_GTM_ID aren't configured (both empty
 * today, see .env). The site currently sets only strictly-necessary
 * cookies/storage (next-intl's own NEXT_LOCALE cookie, and the booking
 * draft in sessionStorage — see BookingWidget.tsx), neither of which
 * needs consent under the ePrivacy rules, so a banner would be pure
 * friction with nothing real behind it. The moment the client adds a
 * real GA4/GTM id to actually start tracking, this banner activates
 * automatically and Analytics.tsx (a Server Component reading the same
 * consent cookie) refuses to render any tracking script until the
 * visitor explicitly accepts — never a "reject" that quietly still
 * tracks, never scripts firing before the choice is made.
 */
export function CookieConsentBanner() {
  const t = useTranslations("Cookies");
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  // Separate from `visible`: when a visitor clicks "Cookie-instellingen"
  // in the footer BEFORE any tracking is configured, that click must
  // still do something — a footer link that silently does nothing on
  // every click is exactly the "dead button" this audit was told to
  // rule out. Shows a small, honest "nothing to configure yet" message
  // instead of the real accept/reject choice, which would be dishonest
  // (there is nothing to actually consent to today).
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (hasTrackingConfigured) {
      // Reading document.cookie can only happen after mount (it doesn't
      // exist during SSR) — always starting `visible` at false and
      // deciding the real value here, once, is the standard hydration-
      // safe pattern for browser-only external state, not the "derive
      // this from props/state instead" case the underlying lint rule
      // normally guards against.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (readConsentCookie() === null) setVisible(true);
    }

    const reopen = () => (hasTrackingConfigured ? setVisible(true) : setInfoOpen(true));
    window.addEventListener(REOPEN_EVENT, reopen);
    return () => window.removeEventListener(REOPEN_EVENT, reopen);
  }, []);

  function decide(value: ConsentValue) {
    // 1 year, SameSite=Lax — a first-party, strictly-necessary cookie
    // (it stores the visitor's own consent choice), not itself subject
    // to consent. `secure` is omitted so this also works over plain
    // http:// during local development; production is https-only
    // anyway (see next.config.mjs's Strict-Transport-Security header).
    document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=31536000; SameSite=Lax`;
    setVisible(false);
    // Analytics.tsx (a Client Component — see its own note on why) picks
    // this up immediately via this event, no navigation needed. router
    // .refresh() stays too: it's cheap and keeps any other server-
    // rendered consent-dependent UI in sync, even though Analytics no
    // longer needs it specifically.
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
    router.refresh();
  }

  if (infoOpen) {
    return (
      <div
        role="status"
        className="fixed inset-x-0 bottom-[92px] z-40 border-t border-border bg-surface px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:px-6 md:bottom-0"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
      >
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground/90">{t("nothingToConfigure")}</p>
          <button
            type="button"
            onClick={() => setInfoOpen(false)}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted-background"
          >
            {t("close")}
          </button>
        </div>
      </div>
    );
  }

  if (!hasTrackingConfigured || !visible) return null;

  return (
    <div
      role="region"
      aria-label={t("bannerTitle")}
      // bottom-[92px] on mobile, not bottom-0: StickyMobileCta.tsx is
      // ALSO fixed to bottom-0 below the md breakpoint (the WhatsApp/
      // Prijzen/Boek nu bar) — stacking both at bottom-0 would let this
      // banner cover the booking CTA, exactly the "popup blocks
      // booking" failure mode this audit was told to rule out. 92px
      // clears the sticky bar's tallest real case (~44px button plus a
      // notched-phone safe-area-inset-bottom, measured in that
      // component's own layout comment) with margin. Reverts to
      // bottom-0 at md and up, where the sticky bar doesn't exist.
      className="fixed inset-x-0 bottom-[92px] z-40 border-t border-border bg-surface px-4 py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] sm:px-6 md:bottom-0"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom, 0px))" }}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/90">
          {t("bannerBody")}{" "}
          <Link href="/cookies" className="font-semibold text-brand-text underline underline-offset-2">
            {t("bannerLink")}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("rejected")}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted-background"
          >
            {t("reject")}
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}

export const COOKIE_SETTINGS_REOPEN_EVENT = REOPEN_EVENT;
