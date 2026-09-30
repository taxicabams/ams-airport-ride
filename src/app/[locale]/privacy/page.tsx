import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";

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
 * Rewritten during a full privacy/AVG audit pass — the previous version
 * (3 short paragraphs) was accurate as far as it went but left out real
 * things this audit specifically checked for: which THIRD PARTIES
 * actually process data (checked against actual code: Resend for email,
 * Google Places/Routes APIs for address autocomplete and distance,
 * Supabase/Postgres for storage, Hostinger for hosting), cookies
 * (spun out to its own /cookies page, linked below), international
 * transfer, security, AP complaint right, and how to actually exercise
 * data-subject rights. Every service named below is one this audit
 * confirmed is genuinely wired into the codebase (see .env.example and
 * src/lib/) — nothing here is aspirational or generic filler.
 *
 * No invented specifics remain (an exact numeric retention period in
 * days, a named data controller entity/address) that the client hasn't
 * actually confirmed — see this session's own report for what's flagged
 * as "INPUT REQUIRED BEFORE LAUNCH" instead of guessed here. A lawyer's
 * review before treating this as final is still a reasonable step, but
 * this is now a real, specific, technically-accurate document, not a
 * generic template.
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
      <p className="mt-2 text-sm text-muted">
        {l === "nl" ? "Laatst bijgewerkt: 30 september 2026" : "Last updated: 30 September 2026"}
      </p>

      <div className="mt-6 space-y-6 text-foreground/90">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Wie is verantwoordelijk?" : "Who is responsible?"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "AMS Airport Ride is verantwoordelijk voor de verwerking van uw persoonsgegevens zoals beschreven in deze verklaring. Voor vragen over uw gegevens kunt u contact met ons opnemen via de contactpagina of WhatsApp."
              : "AMS Airport Ride is responsible for processing your personal data as described in this statement. For questions about your data, you can reach us via the contact page or WhatsApp."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Welke gegevens verwerken wij, en waarom?" : "What data do we process, and why?"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Wanneer u een rit boekt, verwerken wij: uw naam, telefoonnummer, e-mailadres, ophaaladres, bestemming, datum en tijd van de rit, aantal passagiers en bagagestukken, gekozen voertuigtype, en — indien u dit invult — uw vluchtnummer en eventuele opmerkingen bij de boeking. Deze gegevens zijn noodzakelijk om uw boeking daadwerkelijk uit te kunnen voeren: dit is de wettelijke grondslag (uitvoering van de overeenkomst) waarop wij ze verwerken."
              : "When you book a ride, we process: your name, phone number, email address, pickup address, destination, ride date and time, number of passengers and luggage pieces, chosen vehicle type, and — if you provide them — your flight number and any notes with the booking. This data is necessary to actually carry out your booking: this is the legal basis (performance of a contract) on which we process it."}
          </p>
          <p className="mt-2">
            {l === "nl"
              ? "Als u ons benadert via het contactformulier, e-mail of WhatsApp, verwerken wij de gegevens die u daarbij zelf verstrekt, om uw vraag te kunnen beantwoorden (grondslag: gerechtvaardigd belang bij het kunnen reageren op vragen, of voorbereiding van een overeenkomst)."
              : "If you contact us via the contact form, email, or WhatsApp, we process the data you provide in doing so, in order to answer your question (basis: legitimate interest in being able to respond to enquiries, or preparing to enter into a contract)."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Adresinvoer tijdens het boeken" : "Address entry while booking"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Terwijl u een ophaaladres of bestemming typt in de boekingscalculator, wordt uw invoer doorgestuurd naar Google (Places API en Routes API) om adressuggesties te tonen en de afstand/reistijd te berekenen. Dit gebeurt bij elke boeking, ongeacht cookievoorkeuren, omdat het functioneel noodzakelijk is om de vaste prijs te kunnen berekenen — het is geen advertentie- of trackingtechniek. Zie Google's eigen privacybeleid voor hoe Google deze gegevens verwerkt."
              : "As you type a pickup address or destination in the booking calculator, your input is sent to Google (Places API and Routes API) to show address suggestions and calculate distance/travel time. This happens on every booking regardless of cookie preferences, because it's functionally necessary to calculate the fixed price — it is not an advertising or tracking technique. See Google's own privacy policy for how Google processes this data."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Met wie delen wij gegevens?" : "Who do we share data with?"}
          </h2>
          <p className="mt-2">
            {l === "nl" ? "Wij delen boekingsgegevens uitsluitend met partijen die nodig zijn om de dienst te leveren:" : "We share booking data only with parties needed to deliver the service:"}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Resend</strong> —{" "}
              {l === "nl"
                ? "verzendt uw boekingsbevestiging en onze interne notificatie per e-mail."
                : "sends your booking confirmation and our internal notification by email."}
            </li>
            <li>
              <strong>Google (Places API / Routes API)</strong> —{" "}
              {l === "nl" ? "voor adresherkenning en afstandsberekening, zoals hierboven beschreven." : "for address lookup and distance calculation, as described above."}
            </li>
            <li>
              <strong>{l === "nl" ? "Onze database-/hostingleverancier" : "Our database/hosting provider"}</strong> —{" "}
              {l === "nl"
                ? "slaat boekingsgegevens veilig op (Postgres-database) zodat wij uw rit kunnen uitvoeren."
                : "securely stores booking data (Postgres database) so we can carry out your ride."}
            </li>
          </ul>
          <p className="mt-3">
            {l === "nl"
              ? "Wij verkopen uw gegevens nooit aan derden. Zodra wij Google Analytics en/of Google Ads-conversiemeting activeren (zie ons "
              : "We never sell your data to third parties. Once we activate Google Analytics and/or Google Ads conversion measurement (see our "}
            <Link href="/cookies" className="font-semibold text-brand-text underline underline-offset-2">
              {l === "nl" ? "cookiebeleid" : "cookie policy"}
            </Link>
            {l === "nl"
              ? "), gebeurt dit alleen na uw expliciete toestemming, en nooit met uw naam, telefoonnummer, e-mailadres of volledige adresgegevens — alleen geanonimiseerde gebeurtenissen zoals \"boeking voltooid\"."
              : "), this only happens after your explicit consent, and never with your name, phone number, email address, or full address details — only anonymised events such as \"booking completed\"."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Internationale doorgifte" : "International transfers"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Google en Resend kunnen gegevens verwerken op servers buiten de Europese Economische Ruimte. Beide partijen bieden hiervoor passende waarborgen (zoals modelcontractbepalingen van de Europese Commissie)."
              : "Google and Resend may process data on servers outside the European Economic Area. Both providers offer appropriate safeguards for this (such as the European Commission's standard contractual clauses)."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Hoe lang bewaren wij uw gegevens?" : "How long do we keep your data?"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Wij bewaren boekingsgegevens niet langer dan noodzakelijk is om uw boeking uit te voeren, eventuele vragen achteraf te kunnen beantwoorden, en te voldoen aan wettelijke (bijvoorbeeld fiscale) bewaarplichten."
              : "We do not keep booking data longer than necessary to carry out your booking, answer any follow-up questions, and comply with legal (for example, tax-related) retention obligations."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Beveiliging" : "Security"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Wij nemen passende technische maatregelen om uw gegevens te beschermen, waaronder een versleutelde (https) verbinding, serverside validatie van alle ingevoerde gegevens, en beperkingen op hoe vaak formulieren kunnen worden ingediend om misbruik te voorkomen."
              : "We take appropriate technical measures to protect your data, including an encrypted (https) connection, server-side validation of all submitted data, and limits on how often forms can be submitted to prevent abuse."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Uw rechten" : "Your rights"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "U heeft het recht op inzage, correctie, verwijdering en beperking van uw persoonsgegevens, en het recht om bezwaar te maken tegen de verwerking ervan. Neem hiervoor contact met ons op via de contactpagina. Bent u niet tevreden met hoe wij uw klacht afhandelen, dan heeft u het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens."
              : "You have the right to access, correct, delete, and restrict your personal data, and the right to object to its processing. Please contact us via the contact page to do so. If you are not satisfied with how we handle your complaint, you have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens)."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Cookies" : "Cookies"}
          </h2>
          <p className="mt-2">
            {l === "nl" ? "Zie ons aparte " : "See our separate "}
            <Link href="/cookies" className="font-semibold text-brand-text underline underline-offset-2">
              {l === "nl" ? "cookiebeleid" : "cookie policy"}
            </Link>
            {l === "nl"
              ? " voor precies welke cookies en vergelijkbare technieken wij gebruiken."
              : " for exactly which cookies and similar techniques we use."}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {l === "nl" ? "Wijzigingen" : "Changes"}
          </h2>
          <p className="mt-2">
            {l === "nl"
              ? "Wij kunnen deze privacyverklaring bijwerken, bijvoorbeeld wanneer wij een nieuwe dienst (zoals analytics) daadwerkelijk activeren. De datum bovenaan deze pagina geeft aan wanneer de verklaring voor het laatst is aangepast."
              : "We may update this privacy policy, for example when we actually activate a new service (such as analytics). The date at the top of this page indicates when the policy was last changed."}
          </p>
        </div>
      </div>
    </section>
  );
}
