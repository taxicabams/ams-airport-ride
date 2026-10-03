"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_CHANGED_EVENT, readConsentCookie } from "@/lib/cookieConsent";

/**
 * Loads GA4 and/or GTM — but only once a real-looking ID is actually
 * configured (NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GTM_ID, both empty by
 * default — see .env's own note). No ID set means this renders nothing
 * at all: no external script tag, no request to Google, nothing to
 * explain away later. Real IDs always start with "G-" (GA4) or "GTM-"
 * (Tag Manager) — checked here so a stray typo/placeholder value can
 * never accidentally start firing real analytics requests.
 *
 * Rewritten from a Server Component to a Client Component during the
 * Ads-readiness pass that actually turned on a real GA4 ID: the
 * original server-side version called `cookies()` (via
 * cookieConsent.server.ts's getConsent()) on every render to check
 * consent before deciding whether to render the GTM/GA4 <Script> tags.
 * That's correct in principle, but in Next.js's rendering model, using
 * a dynamic API like `cookies()` ANYWHERE in a route's render tree
 * forces that entire route out of static generation — confirmed live
 * in a production build the moment a real ID was set: every single
 * page (homepage, all 60+ route pages, the Ads landing pages) flipped
 * from prerendered static HTML to server-rendered-per-request. That's
 * a real, measurable page-speed regression, and landing-page speed for
 * paid traffic is one of this project's explicit, repeated priorities.
 *
 * The fix: `document.cookie` is a browser-only read, never a Next.js
 * "dynamic API" the framework tracks — reading it from a Client
 * Component's effect (after mount, so after the page has already been
 * served as static HTML) can't force anything server-side to become
 * dynamic. The actual compliance guarantee — never fire a tracking
 * request before the visitor has explicitly accepted — is fully
 * preserved: nothing in this component's JSX ever requests
 * googletagmanager.com until `consented` is true, which happens strictly
 * after the consent check, exactly as before. The only thing that moved
 * is WHEN the check happens (client mount vs. server render), not
 * whether it happens.
 *
 * CONSENT_CHANGED_EVENT (dispatched by CookieConsentBanner.tsx right
 * after writing the cookie) lets this activate immediately once a
 * visitor clicks "accept" on the current page view, without needing a
 * navigation or a server round-trip — a plain window event is simpler
 * and faster than the router.refresh() the old server-read version
 * relied on for the same job.
 */
const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const hasGa4 = Boolean(ga4Id && ga4Id.startsWith("G-"));
const hasGtm = Boolean(gtmId && gtmId.startsWith("GTM-"));

export function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!hasGa4 && !hasGtm) return;
    // Same hydration-safe "browser-only state, decided once on mount"
    // pattern as CookieConsentBanner.tsx's own identical check — always
    // starting `consented` false and reading the real value here (it
    // doesn't exist during SSR) is correct, not the "derive from props/
    // state instead" case this lint rule normally guards against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsented(readConsentCookie() === "accepted");
    const onChange = () => setConsented(readConsentCookie() === "accepted");
    window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  }, []);

  if (!hasGa4 && !hasGtm) return null;
  if (!consented) return null;

  return (
    <>
      {hasGtm && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}
      {hasGa4 && !hasGtm && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}');`}
          </Script>
        </>
      )}
    </>
  );
}
