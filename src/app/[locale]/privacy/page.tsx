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
 * This page states the real personal data this app collects (see
 * prisma/schema.prisma's Booking model) and standard, generic-but-true
 * GDPR baseline principles (purpose limitation, data-subject rights) —
 * deliberately no invented specifics (an exact retention period in
 * days/months, a named data controller address) the client hasn't
 * actually confirmed. Client/legal review is still recommended before
 * treating this as final — see the session's own report — but it no
 * longer shows a "draft, not reviewed" banner to live site visitors,
 * since that read as more alarming than the (accurate, if generic)
 * content underneath it actually is.
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
            ? "Deze gegevens worden gebruikt om uw rit te plannen, u te bevestigen per e-mail, en indien nodig telefonisch contact met u op te nemen over uw boeking. Wij verwerken deze gegevens op grond van de uitvoering van de overeenkomst die ontstaat zodra u een boeking plaatst."
            : "This data is used to plan your ride, confirm it by email, and, if needed, contact you by phone about your booking. We process this data on the basis of performing the contract formed when you place a booking."}
        </p>
        <p>
          {l === "nl"
            ? "Wij bewaren uw gegevens niet langer dan noodzakelijk is voor het uitvoeren van uw boeking en het voldoen aan onze wettelijke (bijvoorbeeld fiscale) bewaarplichten. U heeft het recht om inzage, correctie of verwijdering van uw gegevens te vragen. Neem hiervoor contact met ons op via de contactpagina."
            : "We do not keep your data longer than necessary to carry out your booking and to meet our legal (for example, tax-related) retention obligations. You have the right to request access to, correction of, or deletion of your data. Please contact us via the contact page to do so."}
        </p>
      </div>
    </section>
  );
}
