import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { companyInfo } from "@/lib/companyInfo";

/**
 * "Vertrekbord" rebuild — near-black (--ink-2) slot-CTA per the brief's
 * exact spec (no photo here, unlike the previous Layout 4.0 version):
 * "Vlucht geboekt? Taxi ook." with the second line in amber, plus a
 * WhatsApp button (only rendered while companyInfo.whatsapp is set).
 */
export async function FinalCta() {
  const t = await getTranslations("FinalCtaSimple");
  const tb = await getTranslations("Booking");

  return (
    <section className="bg-ink-2 py-16 text-center text-ink-foreground">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
          {t("title")} <span className="text-brand">{t("titleHighlight")}</span>
        </h2>
        <p className="mt-2 text-ink-foreground-muted">{t("body")}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#boeken"
            className="rounded-[10px] bg-brand px-6 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition duration-150 hover:brightness-110"
          >
            {t("cta")}
          </Link>
          {companyInfo.whatsapp && (
            <TrackedLink
              event="whatsapp_clicked"
              href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(tb("whatsappPrefill"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[10px] border border-white/20 bg-whatsapp/10 px-6 py-3.5 text-base font-semibold text-white transition duration-150 hover:bg-whatsapp/20"
            >
              {t("ctaWhatsapp")}
            </TrackedLink>
          )}
        </div>
      </div>
    </section>
  );
}
