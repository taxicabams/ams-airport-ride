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
    title: locale === "nl" ? "Privacyverklaring" : "Privacy Policy",
    alternates: buildAlternates(locale as AppLocale, "/privacy"),
  };
}

/**
 * ⚠️ DRAFT — this is a structural placeholder, not a reviewed legal
 * document. It names the real personal data this app collects (see
 * prisma/schema.prisma's Booking model) so it's factually accurate
 * about *what* is collected, but the legal basis, retention periods,
 * and data-controller details need sign-off from the client (and
 * ideally a legal professional) before this page is treated as final.
 */
export default async function PrivacyPage({
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
          ? "Concept — deze pagina is een structurele opzet en nog geen juridisch gecontroleerde privacyverklaring. Laat deze tekst controleren voordat de site live gaat."
          : "Draft — this page is a structural outline, not a legally reviewed privacy policy yet. Have this text reviewed before the site goes live."}
      </div>

      <h1 className="text-3xl font-bold text-foreground">
        {l === "nl" ? "Privacyverklaring" : "Privacy Policy"}
      </h1>

      <div className="mt-6 space-y-4 text-foreground/90">
        <p>
          {l === "nl"
            ? "Wanneer u een rit boekt bij AMS Airport Ride, verwerken wij de gegevens die nodig zijn om uw boeking uit te voeren: uw naam, telefoonnummer, e-mailadres, ophaaladres, bestemming, datum en tijd van de rit, aantal passagiers en bagage, en — indien van toepassing — uw vluchtnummer."
            : "When you book a ride with AMS Airport Ride, we process the data needed to carry out your booking: your name, phone number, email address, pickup address, destination, ride date and time, number of passengers and luggage, and — where applicable — your flight number."}
        </p>
        <p>
          {l === "nl"
            ? "Deze gegevens worden gebruikt om uw rit te plannen, u te bevestigen per e-mail, en indien nodig telefonisch contact met u op te nemen over uw boeking."
            : "This data is used to plan your ride, confirm it by email, and, if needed, contact you by phone about your booking."}
        </p>
        <p>
          {l === "nl"
            ? "[Bewaartermijn, rechtsgrond, rechten van betrokkenen, en contactgegevens van de verwerkingsverantwoordelijke volgen hier na juridische controle.]"
            : "[Retention period, legal basis, data subject rights, and data controller contact details will follow here after legal review.]"}
        </p>
      </div>
    </section>
  );
}
