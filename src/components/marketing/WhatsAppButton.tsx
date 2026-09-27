import { getTranslations } from "next-intl/server";
import { companyInfo } from "@/lib/companyInfo";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Floating WhatsApp bubble — desktop only (`hidden md:flex`). On mobile,
 * StickyMobileCta's own 3-button bar (Call/WhatsApp/Book) already
 * covers this job, so showing both would duplicate the same action
 * twice on a small screen. Renders nothing at all while
 * companyInfo.whatsapp is unset; never fabricate a number here — see
 * companyInfo.ts's own null-until-real convention.
 */
export async function WhatsAppButton() {
  if (!companyInfo.whatsapp) return null;

  const t = await getTranslations("Booking");
  const text = encodeURIComponent(t("whatsappPrefill"));

  return (
    <a
      href={`https://wa.me/${companyInfo.whatsapp}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-30 hidden items-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-white shadow-elevated transition hover:brightness-95 md:flex"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden sm:inline">{t("whatsappUs")}</span>
    </a>
  );
}
