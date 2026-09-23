import { getTranslations, getLocale } from "next-intl/server";
import { getSchipholMeetingPointText } from "@/lib/schipholMeetingPoint";

/**
 * The client's requirement: Schiphol pickup instructions must be
 * prominent on the homepage, not buried only in the FAQ (see the plan —
 * this is exactly the gap Taxi Falcon had). The text itself comes from
 * one shared config (lib/schipholMeetingPoint.ts) also used on the
 * confirmation screen and in the booking email.
 */
export async function SchipholInfoCard() {
  const t = await getTranslations("Schiphol");
  const locale = (await getLocale()) as "nl" | "en";

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-brand">{t("title")}</h2>
        <p className="mt-3 max-w-3xl text-foreground/90">
          {getSchipholMeetingPointText(locale)}
        </p>
        <p className="mt-3 max-w-3xl text-sm text-muted">{t("note")}</p>
      </div>
    </section>
  );
}
