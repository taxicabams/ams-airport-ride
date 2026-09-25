import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { companyInfo } from "@/lib/companyInfo";
import { Logo } from "@/components/ui/Logo";

/**
 * Dark (--ink) footer per the design-system brief v2, three columns
 * (Services / Information / Legal) instead of the previous light,
 * four-column layout. "Cancellation Policy" links to the existing
 * /voorwaarden page rather than a new document — that page already has a
 * placeholder line reserved for cancellation terms, marked DRAFT pending
 * real legal review; inventing a separate page with real-sounding policy
 * text would violate this project's standing "never fabricate" rule.
 */
export async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="dark" />
            <p className="mt-3 max-w-xs text-sm text-white/60">{t("tagline")}</p>
          </div>

          {/* Services: descriptive, not links — "Airport transfers" and
              "Private rides" don't have their own pages (see Header's
              note on why), and duplicating the two real links below
              under slightly different labels would just be noise. */}
          <div>
            <p className="text-sm font-semibold text-white">{t("servicesTitle")}</p>
            <ul className="mt-2 space-y-1 text-sm text-white/60">
              <li>{t("serviceSchiphol")}</li>
              <li>{t("serviceAmsterdam")}</li>
              <li>{t("serviceAirportTransfers")}</li>
              <li>{t("servicePrivateRides")}</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{t("infoTitle")}</p>
            <ul className="mt-2 space-y-1 text-sm text-white/60">
              <li>
                <Link href="/#how-it-works" className="hover:text-white">
                  {t("howItWorksLink")}
                </Link>
              </li>
              <li>
                <Link href="/veelgestelde-vragen" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/over-ons" className="hover:text-white">
                  {t("aboutLink")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">{t("legalTitle")}</p>
            <ul className="mt-2 space-y-1 text-sm text-white/60">
              <li>
                <Link href="/voorwaarden" className="hover:text-white">
                  {t("termsLink")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  {t("privacyLink")}
                </Link>
              </li>
              <li>
                {/* Same page as Terms — see the component comment above
                    on why this isn't a separate fabricated document. */}
                <Link href="/voorwaarden" className="hover:text-white">
                  {t("cancellationLink")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} AMS Airport Ride. {t("rights")}
          </p>
          {companyInfo.kvkNumber && <p>KvK {companyInfo.kvkNumber}</p>}
        </div>
      </div>
    </footer>
  );
}
