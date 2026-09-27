import Script from "next/script";

/**
 * Loads GA4 and/or GTM — but only once a real-looking ID is actually
 * configured (NEXT_PUBLIC_GA4_ID / NEXT_PUBLIC_GTM_ID, both empty by
 * default — see .env's own note). No ID set means this renders nothing
 * at all: no external script tag, no request to Google, nothing to
 * explain away later. Real IDs always start with "G-" (GA4) or "GTM-"
 * (Tag Manager) — checked here so a stray typo/placeholder value can
 * never accidentally start firing real analytics requests.
 */
const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
const hasGa4 = Boolean(ga4Id && ga4Id.startsWith("G-"));
const hasGtm = Boolean(gtmId && gtmId.startsWith("GTM-"));

export function Analytics() {
  if (!hasGa4 && !hasGtm) return null;

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
