import { getTranslations } from "next-intl/server";
import { ShieldCheckIcon, ClockIcon, WhatsAppIcon, CalendarIcon } from "@/components/ui/icons";

/**
 * "Vertrekbord" USP band — 4 columns, each with a navy icon block + amber
 * icon, per the brief's exact spec: Prijs staat vast · gratis wachten ·
 * je weet wie er komt · gratis annuleren. The two numeric specifics
 * (wait minutes, cancellation hours) are still unconfirmed real policy
 * values, so their copy keeps the brief's own "[Y]"/"[X]" bracket
 * notation rather than inventing a number.
 */
export async function TrustBar() {
  const t = await getTranslations("TrustBar");
  const items = [
    { Icon: ShieldCheckIcon, title: t("title1"), body: t("body1") },
    { Icon: ClockIcon, title: t("title2"), body: t("body2") },
    { Icon: WhatsAppIcon, title: t("title3"), body: t("body3") },
    { Icon: CalendarIcon, title: t("title4"), body: t("body4") },
  ];

  return (
    <section className="border-b border-border bg-surface py-12">
      <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-8 px-4 sm:px-6 md:grid-cols-4">
        {items.map(({ Icon, title, body }) => (
          <li key={title} className="flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-ink">
              <Icon className="h-5 w-5 text-brand" />
            </span>
            <span>
              <span className="block text-sm font-semibold text-foreground">{title}</span>
              <span className="block text-xs text-muted">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
