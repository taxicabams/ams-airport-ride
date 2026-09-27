import { getTranslations } from "next-intl/server";
import { ShieldCheckIcon, ClockIcon, PaymentIcon, ReceiptIcon } from "@/components/ui/icons";

/**
 * Layout 4.0 — collapsed from four icon+title+body mini-cards into one
 * elegant single-line strip (icon + short label only), per the brief's
 * explicit "geen vier enorme cards... elegante horizontal trust strip,
 * subtiele iconen, veel whitespace, geen zware card borders." The
 * title/body copy pairs still exist in messages (title1/body1, etc.) —
 * only body1-4 go unused here now, kept for now rather than deleted in
 * case a future section wants the fuller two-line version back.
 */
export async function TrustBar() {
  const t = await getTranslations("TrustBar");
  const items = [
    { Icon: ShieldCheckIcon, label: t("title1") },
    { Icon: ClockIcon, label: t("title2") },
    { Icon: PaymentIcon, label: t("title3") },
    { Icon: ReceiptIcon, label: t("title4") },
  ];

  return (
    <section className="border-b border-border bg-surface py-8">
      <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 sm:px-6">
        {items.map(({ Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
            <Icon className="h-5 w-5 shrink-0 text-brand-text" />
            {label}
          </li>
        ))}
      </ul>
    </section>
  );
}
