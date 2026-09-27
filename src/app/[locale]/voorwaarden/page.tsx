import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";

type Locale = "nl" | "en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "nl" ? "Algemene voorwaarden" : "Terms and Conditions",
    alternates: buildAlternates(locale as AppLocale, "/voorwaarden"),
  };
}

/**
 * See the note in privacy/page.tsx — same reasoning applies here: no
 * invented specifics for provisions that are genuinely the client's own
 * business decision to make (a cancellation window, a liability cap),
 * but no visible "draft, not reviewed" banner either. The closing
 * paragraph is a real, honest sentence (contact us for specifics), not
 * a placeholder bracket.
 */
export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">
        {l === "nl" ? "Algemene voorwaarden" : "Terms and Conditions"}
      </h1>

      <div className="mt-6 space-y-4 text-foreground/90">
        <p>
          {l === "nl"
            ? "Bij het boeken van een rit ontvangt u vooraf een vaste prijs. Deze prijs is gebaseerd op de door u opgegeven ophaaladres, bestemming, datum, tijd, aantal passagiers, bagage en gekozen voertuig."
            : "When booking a ride, you receive a fixed price upfront. This price is based on the pickup address, destination, date, time, number of passengers, luggage, and vehicle you provide."}
        </p>
        <p>
          {l === "nl"
            ? "Betaling vindt plaats na afloop van de rit, rechtstreeks aan de chauffeur, per PIN of contant. Online vooruitbetaling is niet vereist."
            : "Payment takes place after the ride, directly to the driver, by card or cash. Online prepayment is not required."}
        </p>
        <p>
          {l === "nl"
            ? "Heeft u vragen over annulering, wachttijden of aansprakelijkheid, neem dan rechtstreeks contact met ons op via de contactpagina — wij helpen u graag verder."
            : "If you have questions about cancellation, waiting times, or liability, please contact us directly via the contact page — we're happy to help."}
        </p>
      </div>
    </section>
  );
}
