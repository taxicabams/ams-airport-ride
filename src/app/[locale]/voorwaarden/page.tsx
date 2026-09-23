import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Locale = "nl" | "en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "nl" ? "Algemene voorwaarden" : "Terms and Conditions" };
}

/** ⚠️ DRAFT — see the note in privacy/page.tsx; same caveat applies here. */
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
      <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
        {l === "nl"
          ? "Concept — deze pagina is een structurele opzet en nog geen juridisch gecontroleerde algemene voorwaarden. Laat deze tekst controleren voordat de site live gaat."
          : "Draft — this page is a structural outline, not legally reviewed terms and conditions yet. Have this text reviewed before the site goes live."}
      </div>

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
            ? "[Annuleringsvoorwaarden, aansprakelijkheid, wachttijden en overige bepalingen volgen hier na juridische controle.]"
            : "[Cancellation terms, liability, waiting times, and other provisions will follow here after legal review.]"}
        </p>
      </div>
    </section>
  );
}
