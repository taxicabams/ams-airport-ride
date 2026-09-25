import { getTranslations } from "next-intl/server";
import { companyInfo } from "@/lib/companyInfo";
import { WhatsAppIcon } from "@/components/ui/icons";

/**
 * Floating WhatsApp bubble, per the brief — but companyInfo.whatsapp is
 * `null` today (no real, staffed number confirmed yet), so this renders
 * nothing until the client supplies one. Never fabricate a number here;
 * see companyInfo.ts's own null-until-real convention.
 *
 * `bottom-20` clears StickyMobileCta's fixed bar on mobile; `md:bottom-6`
 * on desktop, which has no sticky bar to avoid.
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
      className="fixed bottom-20 right-4 z-30 flex items-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-white shadow-elevated transition hover:brightness-95 md:bottom-6"
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="hidden sm:inline">{t("whatsappUs")}</span>
    </a>
  );
}
