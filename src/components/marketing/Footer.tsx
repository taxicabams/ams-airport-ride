import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { companyInfo } from "@/lib/companyInfo";
import { AmsterdamSkyline } from "./AmsterdamSkyline";

export async function Footer() {
  const t = await getTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted-background">
      {/* Same brand motif as the hero, thinner — ties the top and bottom
          of every page together without repeating a whole section. */}
      <AmsterdamSkyline className="h-6 w-full text-brand/10" />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-brand">AMS Airport Ride</p>
            <p className="mt-2 max-w-xs text-sm text-muted">{t("tagline")}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">{t("company")}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              <li>
                <Link href="/over-ons" className="hover:text-brand">
                  {t("aboutLink")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/veelgestelde-vragen" className="hover:text-brand">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">{t("support")}</p>
            <ul className="mt-2 space-y-1 text-sm text-muted">
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
