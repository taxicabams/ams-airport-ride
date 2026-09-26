import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { companyInfo } from "@/lib/companyInfo";
import { Logo } from "@/components/ui/Logo";

/**
 * v9 rebuild — one minimal link list instead of the previous 4-column
 * grid, per the client's exact spec: logo + tagline, a single row of
 * links, then Privacy/Terms and the copyright line. Real company facts
 * only (KvK, when known) — never a fabricated license/certification.
 */
export async function Footer() {
  const t = await getTranslations("Footer");
  const tr = await getTranslations("Routes");
  const year = new Date().getFullYear();

  const links = [
    { href: "/#populaire-routes", label: t("serviceSchiphol") },
    { href: "/#amsterdam-taxi", label: t("serviceAmsterdam") },
    { href: "/#populaire-routes", label: tr("eyebrow") },
    { href: "/#hoe-het-werkt", label: t("howItWorksLink") },
    { href: "/veelgestelde-vragen", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <footer className="bg-ink text-white/70">
      <div className="mx-auto max-w-4xl px-4 py-10 text-center sm:px-6">
        <Link href="/" className="inline-block">
          <Logo variant="dark" />
        </Link>
        <p className="mx-auto mt-3 max-w-xs text-sm text-white/60">{t("tagline")}</p>

        {(companyInfo.phone || companyInfo.email) && (
          <p className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
            {companyInfo.phone && (
              <a href={`tel:${companyInfo.phone}`} className="font-medium text-white hover:text-white/80">
                {companyInfo.phone}
              </a>
            )}
            {companyInfo.email && (
              <a href={`mailto:${companyInfo.email}`} className="font-medium text-white hover:text-white/80">
                {companyInfo.email}
              </a>
            )}
          </p>
        )}

        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="text-white/70 hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 flex justify-center gap-6 text-xs">
          <Link href="/privacy" className="text-white/50 hover:text-white/80">
            {t("privacyLink")}
          </Link>
          <Link href="/voorwaarden" className="text-white/50 hover:text-white/80">
            {t("termsLink")}
          </Link>
        </div>

        <div className="mt-6 border-t border-white/10 pt-5 text-xs text-white/50">
          <p>
            © {year} AMS Airport Ride. {t("rights")}
            {companyInfo.kvkNumber && ` · KvK ${companyInfo.kvkNumber}`}
          </p>
        </div>
      </div>
    </footer>
  );
}
