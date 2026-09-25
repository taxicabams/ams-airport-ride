import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { companyInfo } from "@/lib/companyInfo";
import { AmsterdamSkyline } from "./AmsterdamSkyline";
import { Logo } from "@/components/ui/Logo";

export async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted-background">
      {/* Same brand motif as the hero, thinner — ties the top and bottom
          of every page together without repeating a whole section. */}
      <AmsterdamSkyline className="h-6 w-full text-brand/10" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted">{t("tagline")}</p>
          </div>

          {/* Services: descriptive, not links — "Airport transfers" and
              "Private rides" don't have their own pages (see Header's
              note on why), and duplicating the two real links below
              under slightly different labels would just be noise. */}
          <div>
            <p className="text-sm font-semibold text-foreground">{t("servicesTitle")}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>{t("serviceAmsterdam")}</li>
              <li>{t("serviceSchiphol")}</li>
              <li>{t("serviceAirportTransfers")}</li>
              <li>{t("servicePrivateRides")}</li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">{t("helpTitle")}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>
                <Link href="/over-ons" className="hover:text-brand">
                  {t("aboutLink")}
                </Link>
              </li>
              <li>
                <Link href="/veelgestelde-vragen" className="hover:text-brand">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/#boeken" className="hover:text-brand">
                  {t("bookLink")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/voorwaarden" className="hover:text-brand">
                  {t("termsLink")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">{t("paymentTitle")}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>{t("paymentCard")}</li>
              <li>{t("paymentCash")}</li>
              <li>{t("paymentReceipt")}</li>
            </ul>
            {(companyInfo.phone || companyInfo.email) && (
              <ul className="mt-4 space-y-1 border-t border-border pt-4 text-sm text-muted">
                {companyInfo.phone && (
                  <li>
                    <a href={`tel:${companyInfo.phone}`} className="hover:text-brand">
                      {companyInfo.phone}
                    </a>
                  </li>
                )}
                {companyInfo.email && (
                  <li>
                    <a href={`mailto:${companyInfo.email}`} className="hover:text-brand">
                      {companyInfo.email}
                    </a>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} AMS Airport Ride. {t("rights")}
          </p>
          {companyInfo.kvkNumber && <p>KvK {companyInfo.kvkNumber}</p>}
        </div>
      </div>
    </footer>
  );
}
