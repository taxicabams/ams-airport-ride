import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { CookieSettingsLink } from "@/components/marketing/CookieSettingsLink";
import { ROUTE_PAGES, routePageCopy } from "@/lib/routes-data";
import { getLocale } from "next-intl/server";

/**
 * "Vertrekbord" rebuild — 3 columns: services, routes, info. Originally
 * had a 4th "Bedrijfsgegevens" (company details) column for address/
 * KvK/BTW/ILT-taxivergunning; removed outright (not just hidden) per
 * the client's explicit instruction — see the grid comment below and
 * companyInfo.ts's header for the full reasoning.
 */
export async function Footer() {
  const t = await getTranslations("Footer");
  const tn = await getTranslations("Nav");
  const locale = (await getLocale()) as "nl" | "en";
  const year = new Date().getFullYear();
  const topRoutes = ROUTE_PAGES.filter((r) => r.direction === "from-schiphol").slice(0, 6);

  const services = [
    { href: "/#populaire-routes", label: t("serviceSchiphol") },
    { href: "/#amsterdam-taxi", label: t("serviceAmsterdam") },
    { href: "/#onze-autos", label: tn("ourCars") },
  ];

  const info = [
    { href: "/over-ons", label: t("aboutLink") },
    { href: "/veelgestelde-vragen", label: "FAQ" },
    { href: "/contact", label: "Contact" },
    { href: "/voorwaarden", label: t("termsLink") },
    { href: "/privacy", label: t("privacyLink") },
    { href: "/cookies", label: t("cookiesLink") },
  ];

  return (
    <footer className="bg-ink-2 text-ink-foreground-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Link href="/" className="inline-block">
          <Logo variant="dark" />
        </Link>
        <p className="mt-3 max-w-xs text-sm">{t("tagline")}</p>

        {/* The "Bedrijfsgegevens" (company details) column — address/
            KvK/BTW/ILT-taxivergunning — was removed outright per the
            client's explicit instruction: "beste niks over vergunningen
            op bedrijfsgegevens etc, alles gewoon amsairportride" (best
            nothing about permits/company details, just everything as
            AMS Airport Ride). Not hidden-when-empty anymore (that was
            the previous, now superseded, fix for the same visual gap) —
            those fields no longer exist in companyInfo.ts at all, so
            there's nothing to ever conditionally show here. 3 real
            columns now, grid adjusted accordingly. */}
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-white/50">
              {t("servicesTitle")}
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {services.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-white/50">
              {t("routesTitle")}
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {topRoutes.map((route) => {
                const { city } = routePageCopy(route, locale);
                return (
                  <li key={route.slug}>
                    <Link href={`/${route.slug}`} className="hover:text-white">
                      {city}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-white/50">
              {t("infoTitle")}
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {info.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* Only meaningful once GA4/GTM is actually configured
                  (CookieConsentBanner.tsx renders nothing before that) —
                  kept in the footer unconditionally anyway since a
                  visitor who already said yes/no needs a stable, always-
                  findable way to change their mind, not one that
                  disappears along with the banner itself. */}
              <li>
                <CookieSettingsLink label={t("cookieSettingsLink")} />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs">
          <p>© {year} AMS Airport Ride. {t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
