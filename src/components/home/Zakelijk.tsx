import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BriefcaseIcon } from "@/components/ui/icons";
import { companyInfo } from "@/lib/companyInfo";

/**
 * Simple informational section, not a real business-account system —
 * there is no invoicing/account backend in this codebase yet (that's a
 * real feature, not a visual restyle, and stays out of scope for this
 * homepage pass). "Zakelijk account aanvragen" links to Contact, which
 * genuinely exists, rather than a not-yet-built account-request flow.
 */
export async function Zakelijk() {
  const t = await getTranslations("Zakelijk");
  const items = [t("item1"), t("item2"), t("item3")];

  return (
    <section id="zakelijk" className="scroll-mt-24 bg-ink py-16 text-ink-foreground">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/10">
              <BriefcaseIcon className="h-5 w-5 text-brand" />
            </span>
            <h2 className="mt-4 font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-brand">{t("subtitle")}</p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-foreground-muted">
              {items.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="rounded-[10px] bg-brand px-5 py-2.5 text-center text-sm font-semibold text-brand-foreground shadow-sm transition duration-150 hover:bg-brand-dark"
            >
              {t("ctaAccount")}
            </Link>
            {companyInfo.phone && (
              <a
                href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
                className="rounded-[10px] border border-white/20 px-5 py-2.5 text-center text-sm font-semibold text-white transition duration-150 hover:bg-white/10"
              >
                {t("ctaCall")}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
