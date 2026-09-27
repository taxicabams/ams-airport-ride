import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { companyInfo } from "@/lib/companyInfo";
import { Logo } from "@/components/ui/Logo";
import { ROUTE_PAGES, routePageCopy } from "@/lib/routes-data";
import { getLocale } from "next-intl/server";

/**
 * "Vertrekbord" rebuild — 4 columns per the brief's exact spec:
 * company details (address/KvK/BTW/ILT), services, routes, info. All
 * company-detail values come from companyInfo.ts, which the client
 * asked to fill with obvious "1234567"-style preview placeholders — see
 * that file's header comment; nothing here is invented independently.
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
  ];

  return (
    <footer className="bg-ink-2 text-ink-foreground-muted">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Link href="/" className="inline-block">
          <Logo variant="dark" />
        </Link>
        <p className="mt-3 max-w-xs text-sm">{t("tagline")}</p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-white/50">
              {t("companyDetailsTitle")}
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {companyInfo.address && <li>{companyInfo.address}</li>}
              {companyInfo.phone && (
                <li>
                  <a href={`tel:${companyInfo.phone.replace(/\s/g, "")}`} className="hover:text-white">
                    {companyInfo.phone}
                  </a>
                </li>
              )}
              {companyInfo.email && (
                <li>
                  <a href={`mailto:${companyInfo.email}`} className="hover:text-white">
                    {companyInfo.email}
                  </a>
                </li>
              )}
              {companyInfo.kvkNumber && <li>KvK {companyInfo.kvkNumber}</li>}
              {companyInfo.btwNumber && <li>BTW {companyInfo.btwNumber}</li>}
              {companyInfo.licenseNumber && <li>ILT {companyInfo.licenseNumber}</li>}
            </ul>
          </div>

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
