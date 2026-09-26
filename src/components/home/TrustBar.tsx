import { getTranslations } from "next-intl/server";
import { ShieldCheckIcon, ClockIcon, PaymentIcon, ReceiptIcon } from "@/components/ui/icons";

/**
 * v10 rebuild — four short title+description items with an icon each,
 * per the client's new mockup (was a single-line checkmark list in v9).
 * Still exactly four real, provable claims, nothing invented.
 */
export async function TrustBar() {
  const t = await getTranslations("TrustBar");
  const items = [
    { Icon: ShieldCheckIcon, title: t("title1"), body: t("body1") },
    { Icon: ClockIcon, title: t("title2"), body: t("body2") },
    { Icon: PaymentIcon, title: t("title3"), body: t("body3") },
    { Icon: ReceiptIcon, title: t("title4"), body: t("body4") },
  ];

  return (
    <section className="border-b border-border bg-surface py-10">
      <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 px-4 text-center sm:px-6 md:grid-cols-4">
        {items.map(({ Icon, title, body }) => (
          <li key={title} className="flex flex-col items-center gap-2">
            <Icon className="h-6 w-6 text-brand-text" />
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted">{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
