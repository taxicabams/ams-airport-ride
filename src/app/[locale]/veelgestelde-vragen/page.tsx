import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { GENERAL_FAQ } from "@/lib/faq";
import { buildAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";

type Locale = "nl" | "en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const base = locale === "nl"
    ? { title: "Veelgestelde vragen", description: "Antwoorden op de meest gestelde vragen over boeken, prijzen, betalen en Schiphol-pickup bij AMS Airport Ride." }
    : { title: "FAQ", description: "Answers to the most common questions about booking, pricing, payment, and Schiphol pickup with AMS Airport Ride." };
  return { ...base, alternates: buildAlternates(locale as AppLocale, "/veelgestelde-vragen") };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const items = GENERAL_FAQ[l];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold text-foreground">
        {l === "nl" ? "Veelgestelde vragen" : "Frequently asked questions"}
      </h1>
      <div className="mt-6 divide-y divide-border rounded-xl border border-border">
        {items.map((item) => (
          <details key={item.q} className="group p-4">
            <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
              <span className="flex items-center justify-between gap-4">
                {item.q}
                <span className="text-muted transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-2 text-sm text-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
