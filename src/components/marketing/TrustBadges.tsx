import { getTranslations } from "next-intl/server";

/**
 * Real information only (see companyInfo.ts / the plan): every claim
 * here is something AMS Airport Ride can actually stand behind
 * operationally — no star ratings, certification badges, or named
 * testimonials until the client supplies real ones.
 */
export async function TrustBadges() {
  const t = await getTranslations("Trust");

  const items = [
    { title: t("fixedPriceTitle"), body: t("fixedPriceBody"), icon: "€" },
    { title: t("availableTitle"), body: t("availableBody"), icon: "24/7" },
    { title: t("experiencedTitle"), body: t("experiencedBody"), icon: "★" },
    { title: t("paymentTitle"), body: t("paymentBody"), icon: "💳" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-xl border border-border p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
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
