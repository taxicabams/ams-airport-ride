import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

type Locale = "nl" | "en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "nl" ? "Cookiebeleid" : "Cookie Policy",
    alternates: buildAlternates(locale as AppLocale, "/cookies"),
  };
}

/**
 * Written to match what the site actually does today, checked during a
 * full audit pass of every cookie/localStorage/sessionStorage/tracking
 * call site in the codebase (see the session notes) — not a generic
 * template. Two real findings shaped this page directly:
 *
 * 1. Today, the ONLY things touching browser storage are next-intl's
 *    own NEXT_LOCALE cookie (language choice) and a sessionStorage
 *    booking draft (BookingWidget.tsx) — both strictly necessary, both
 *    listed here honestly instead of padding the page with categories
 *    that don't apply yet.
 * 2. GA4/GTM (Analytics.tsx) exist in code but are INACTIVE
 *    (NEXT_PUBLIC_GA4_ID/NEXT_PUBLIC_GTM_ID are empty) and, even once
 *    configured, will only load after explicit consent via
 *    CookieConsentBanner.tsx. This page says exactly that, including
 *    that no consent banner shows today because there's nothing yet to
 *    ask consent for — so this page is accurate on day one AND stays
 *    accurate the moment analytics is switched on, without needing a
 *    rewrite then.
 */
export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">
        {l === "nl" ? "Cookiebeleid" : "Cookie Policy"}
      </h1>

      <div className="mt-6 space-y-6 text-foreground/90">
        <p>
          {l === "nl"
            ? "Deze pagina legt uit welke cookies en vergelijkbare technieken (zoals lokale opslag in uw browser) AMS Airport Ride daadwerkelijk gebruikt — niet meer en niet minder dan wat hieronder staat."
            : "This page explains which cookies and similar techniques (such as local storage in your browser) AMS Airport Ride actually uses — no more and no less than what's listed below."}
        </p>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Noodzakelijke cookies en opslag" : "Strictly necessary cookies and storage"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Deze zijn nodig om de website te laten functioneren en vereisen geen toestemming."
              : "These are required for the website to function and do not require consent."}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>NEXT_LOCALE</strong> —{" "}
              {l === "nl"
                ? "onthoudt of u de site in het Nederlands of Engels bekijkt. Vervalt automatisch na verloop van tijd."
                : "remembers whether you're viewing the site in Dutch or English. Expires automatically after a period of time."}
            </li>
            <li>
              <strong>ams_consent</strong> —{" "}
              {l === "nl"
                ? "slaat uw eigen keuze op deze pagina op (geaccepteerd/geweigerd), zodat we niet elke keer opnieuw hoeven te vragen. Geldig 1 jaar."
                : "stores your own choice on this page (accepted/rejected), so we don't have to ask again every time. Valid for 1 year."}
            </li>
            <li>
              {l === "nl" ? "Tijdelijke opslag van uw boeking-in-uitvoering" : "Temporary storage of your in-progress booking"} (
              <code className="text-sm">sessionStorage</code>) —{" "}
              {l === "nl"
                ? "zodat u niet alles opnieuw hoeft in te vullen als u per ongeluk terugnavigeert. Verdwijnt automatisch zodra u het tabblad sluit, en direct na een succesvolle boeking."
                : "so you don't have to re-enter everything if you accidentally navigate back. Disappears automatically when you close the tab, and immediately after a successful booking."}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Analytische en advertentiecookies" : "Analytics and advertising cookies"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Op dit moment zijn er GEEN analytische of advertentiecookies actief op deze website — daarom ziet u nu geen cookiebanner. Zodra wij Google Analytics en/of Google Ads-conversiemeting activeren, verschijnt er automatisch een banner die expliciet om uw toestemming vraagt vóórdat er iets wordt geladen. Weigert u? Dan wordt er niets geplaatst. Verandert u later van gedachten (in beide richtingen), dan kunt u dat altijd aanpassen via \"Cookie-instellingen\" onderaan iedere pagina."
              : "There are currently NO analytics or advertising cookies active on this website — that's why you don't see a cookie banner right now. Once we activate Google Analytics and/or Google Ads conversion measurement, a banner will automatically appear that explicitly asks for your consent before anything loads. If you decline, nothing is placed. If you change your mind later (in either direction), you can always adjust this via \"Cookie settings\" at the bottom of every page."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Uw keuze wijzigen" : "Changing your choice"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Klik op \"Cookie-instellingen\" in de footer om uw keuze op elk moment opnieuw te maken. U kunt ook cookies handmatig verwijderen via de instellingen van uw browser."
              : "Click \"Cookie settings\" in the footer to make your choice again at any time. You can also remove cookies manually via your browser's settings."}
          </p>
        </div>

        <p>
          {l === "nl"
            ? "Zie ook onze "
            : "See also our "}
          <Link href="/privacy" className="font-semibold text-brand-text underline underline-offset-2">
            {l === "nl" ? "privacyverklaring" : "privacy policy"}
          </Link>
          {l === "nl"
            ? " voor meer over hoe wij met persoonsgegevens omgaan."
            : " for more on how we handle personal data."}
        </p>
      </div>
    </section>
  );
}
