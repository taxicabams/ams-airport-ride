import { getTranslations } from "next-intl/server";
import { PriceTagIcon, CalendarIcon, DoorIcon, PaymentIcon } from "@/components/ui/icons";

/**
 * Real information only (see companyInfo.ts / the plan): every claim
 * here is something AMS Airport Ride can actually stand behind
 * operationally — no star ratings, certification badges, or named
 * testimonials until the client supplies real ones.
 *
 * Icons are the same hand-drawn SVG set used everywhere else — this
 * used to be text glyphs ("€", "24/7", "★", "💳"), which read as
 * placeholder-ish; a real icon set is one of the concrete "premium, not
 * cheap webapp" fixes from the redesign brief.
 */
export async function TrustBadges() {
  const t = await getTranslations("Trust");

  const items = [
    { title: t("fixedPriceTitle"), body: t("fixedPriceBody"), icon: <PriceTagIcon className="h-5 w-5" /> },
    { title: t("easyBookingTitle"), body: t("easyBookingBody"), icon: <CalendarIcon className="h-5 w-5" /> },
    { title: t("doorToDoorTitle"), body: t("doorToDoorBody"), icon: <DoorIcon className="h-5 w-5" /> },
    { title: t("paymentTitle"), body: t("paymentBody"), icon: <PaymentIcon className="h-5 w-5" /> },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border bg-surface p-5 shadow-card transition hover:shadow-card-hover"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
              {item.icon}
            </div>
            <p className="mt-3 font-semibold text-foreground">{item.title}</p>
            <p className="mt-1 text-sm text-muted">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
