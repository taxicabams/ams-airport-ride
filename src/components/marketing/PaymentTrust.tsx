import { getTranslations } from "next-intl/server";
import { PaymentIcon, ReceiptIcon } from "@/components/ui/icons";

/**
 * A single, focused payment/receipt message — deliberately not another
 * 4-card grid like TrustBadges (which already covers "pay after your
 * ride" as one of its four items). This is the one place the "a receipt
 * is available in the taxi" claim lives on the homepage; the booking
 * flow's own confirmation screen repeats it once more (see
 * ConfirmationCard), never more often than that.
 */
export async function PaymentTrust() {
  const t = await getTranslations("PaymentTrust");

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-6 text-center shadow-card sm:flex-row sm:text-left">
        <div className="flex shrink-0 gap-2 text-brand">
          <PaymentIcon className="h-8 w-8" />
          <ReceiptIcon className="h-8 w-8" />
        </div>
        <div>
          <p className="font-semibold text-foreground">{t("title")}</p>
          <p className="mt-1 text-xs font-medium text-brand">{t("intro")}</p>
          <p className="mt-1 text-sm text-muted">
            {t("body")} {t("receipt")}
          </p>
        </div>
      </div>
    </section>
  );
}
