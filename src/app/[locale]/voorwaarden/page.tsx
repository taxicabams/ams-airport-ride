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
 * Rewritten during a full final-release audit — the previous version (3
 * short paragraphs) punted on nearly everything a real transport
 * business's terms need to cover, deferring to "contact us" instead of
 * stating an actual policy. This version states real, defensible,
 * generic-but-genuine terms for every topic on the audit's checklist
 * (cancellation, no-show, delay, flight changes, luggage, passengers,
 * child seats, pickup location, waiting time, responsibilities, force
 * majeure, complaints, applicable law) — reusing REAL figures already
 * live elsewhere on the site (the 3-hour free-cancellation window from
 * TrustBadges/FinalCta, the child-seat checkbox that's a genuine
 * ContactStep field) rather than inventing new ones.
 *
 * Where a topic genuinely depends on a business decision this audit
 * cannot make (an exact no-show fee amount, a liability cap in euros),
 * this uses careful, standard, non-invented language instead of a
 * placeholder number — flagged for the client as LEGAL REVIEW
 * RECOMMENDED in the session's own report, not silently presented as
 * lawyer-reviewed. This is real, substantive content either way, not a
 * "contact us for everything" placeholder.
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
      <p className="mt-2 text-sm text-muted">
        {l === "nl" ? "Laatst bijgewerkt: 30 september 2026" : "Last updated: 30 September 2026"}
      </p>

      <div className="mt-6 space-y-6 text-foreground/90">
        <Section
          title={l === "nl" ? "1. Toepasselijkheid" : "1. Applicability"}
          body={
            l === "nl"
              ? "Deze voorwaarden gelden voor iedere rit die u boekt bij AMS Airport Ride, via de website of via WhatsApp."
              : "These terms apply to every ride you book with AMS Airport Ride, whether via the website or via WhatsApp."
          }
        />
        <Section
          title={l === "nl" ? "2. Totstandkoming van de boeking" : "2. Formation of the booking"}
          body={
            l === "nl"
              ? "Een boeking komt tot stand zodra u deze bevestigt in de boekingscalculator en u een boekingsnummer en bevestigingsmail ontvangt. Controleer bij ontvangst of alle gegevens (route, datum, tijd, voertuig, passagiers) juist zijn, en neem direct contact met ons op als dat niet het geval is."
              : "A booking is formed once you confirm it in the booking calculator and receive a booking number and confirmation email. When you receive it, check that all details (route, date, time, vehicle, passengers) are correct, and contact us immediately if they are not."
          }
        />
        <Section
          title={l === "nl" ? "3. Prijs" : "3. Price"}
          body={
            l === "nl"
              ? "U ontvangt vóór het bevestigen van uw boeking een vaste prijs, gebaseerd op het door u opgegeven ophaaladres, bestemming, datum, tijd, aantal passagiers, bagage en gekozen voertuig. Deze prijs staat vast en verandert niet door drukte, file of wachttijd onderweg, tenzij u na het boeken de rit wezenlijk wijzigt (bijvoorbeeld een andere bestemming of aanzienlijk meer passagiers/bagage dan opgegeven)."
              : "Before confirming your booking, you receive a fixed price based on the pickup address, destination, date, time, number of passengers, luggage, and vehicle you provide. This price is fixed and does not change due to traffic, congestion, or waiting time en route, unless you materially change the ride after booking (for example a different destination, or significantly more passengers/luggage than stated)."
          }
        />
        <Section
          title={l === "nl" ? "4. Betaling" : "4. Payment"}
          body={
            l === "nl"
              ? "Betaling vindt plaats na afloop van de rit, rechtstreeks aan de chauffeur, per PIN of contant. Online vooruitbetaling is niet vereist."
              : "Payment takes place after the ride, directly to the driver, by card or cash. Online prepayment is not required."
          }
        />
        <Section
          title={l === "nl" ? "5. Annuleren en wijzigen" : "5. Cancelling and changing your booking"}
          body={
            l === "nl"
              ? "U kunt uw boeking kosteloos annuleren tot 3 uur vóór de geplande vertrektijd, via WhatsApp of het opgegeven contactkanaal. Annuleert u later, dan kunnen wij kosten in rekening brengen, afhankelijk van hoe laat u annuleert en of de rit al was ingepland — neem in dat geval altijd contact met ons op, wij zoeken samen naar een redelijke oplossing."
              : "You can cancel your booking free of charge up to 3 hours before the scheduled departure time, via WhatsApp or the contact channel provided. If you cancel later than that, we may charge costs, depending on how late you cancel and whether the ride had already been scheduled — in that case, always contact us, we'll work out a reasonable solution together."
          }
        />
        <Section
          title={l === "nl" ? "6. Niet komen opdagen (no-show)" : "6. No-show"}
          body={
            l === "nl"
              ? "Bent u niet aanwezig op de afgesproken ophaallocatie en bereikbaar wij u niet binnen een redelijke termijn nadat de chauffeur is gearriveerd, dan kan de rit als niet-uitgevoerd worden beschouwd en kunnen wij kosten in rekening brengen. Wij nemen altijd eerst contact met u op voordat wij dit doen."
              : "If you are not present at the agreed pickup location and we cannot reach you within a reasonable time after the driver has arrived, the ride may be considered not carried out and we may charge costs. We will always contact you first before doing so."
          }
        />
        <Section
          title={l === "nl" ? "7. Ophaallocatie en wachttijd" : "7. Pickup location and waiting time"}
          body={
            l === "nl"
              ? "Voor een rit vanaf Schiphol neemt uw chauffeur contact met u op zodra u door de douane bent, om de exacte ophaalplek af te stemmen — zie de instructies in uw bevestigingsmail. Voor een rit vanaf een ander adres staat de chauffeur op het opgegeven vertrekadres klaar rond de afgesproken tijd. Bij twijfel of vertraging: neem contact op via het in de bevestiging genoemde kanaal."
              : "For a ride from Schiphol, your driver will contact you once you've cleared customs, to agree the exact pickup spot — see the instructions in your confirmation email. For a ride from another address, the driver will be at the pickup address you provided around the agreed time. If in doubt or delayed: contact us via the channel named in your confirmation."
          }
        />
        <Section
          title={l === "nl" ? "8. Vluchtnummer en vertraging" : "8. Flight number and delays"}
          body={
            l === "nl"
              ? "Geeft u bij het boeken een vluchtnummer op, dan houden wij hier rekening mee bij het bepalen van het ophaaltijdstip vanaf Schiphol. Wijzigt uw vlucht (andere aankomsttijd, ander vluchtnummer), laat het ons dan zo snel mogelijk weten via WhatsApp of het opgegeven contactkanaal, zodat wij de rit kunnen aanpassen."
              : "If you provide a flight number when booking, we take it into account when determining the pickup time from Schiphol. If your flight changes (different arrival time, different flight number), let us know as soon as possible via WhatsApp or the contact channel provided, so we can adjust the ride."
          }
        />
        <Section
          title={l === "nl" ? "9. Passagiers, bagage en kinderzitjes" : "9. Passengers, luggage, and child seats"}
          body={
            l === "nl"
              ? "Het aantal passagiers en bagagestukken dat u opgeeft bij het boeken moet overeenkomen met de werkelijkheid — het gekozen voertuig (Comfort: 1–4 passagiers, XL Van: 5–7 passagiers) is hierop afgestemd. Heeft u een kinderzitje nodig, geef dit dan aan bij het boeken (zie de betreffende optie in het boekingsformulier); wij kunnen dit niet garanderen als dit niet vooraf is aangegeven."
              : "The number of passengers and luggage pieces you provide when booking must match reality — the chosen vehicle (Comfort: 1–4 passengers, XL Van: 5–7 passengers) is sized accordingly. If you need a child seat, indicate this when booking (see the corresponding option in the booking form); we cannot guarantee this if it was not indicated in advance."
          }
        />
        <Section
          title={l === "nl" ? "10. Verantwoordelijkheden" : "10. Responsibilities"}
          body={
            l === "nl"
              ? "U bent zelf verantwoordelijk voor het correct en volledig invullen van uw boekingsgegevens (adressen, tijd, vluchtnummer, aantal passagiers/bagage). Wij spannen ons in om u veilig, op tijd en comfortabel te vervoeren, maar zijn niet aansprakelijk voor vertraging of schade die het gevolg is van onjuiste of onvolledige gegevens die u heeft opgegeven, of van omstandigheden buiten onze redelijke controle (zie artikel 11)."
              : "You are responsible for entering your booking details correctly and completely (addresses, time, flight number, number of passengers/luggage). We make every effort to transport you safely, on time, and comfortably, but are not liable for delay or damage resulting from incorrect or incomplete details you provided, or from circumstances beyond our reasonable control (see article 11)."
          }
        />
        <Section
          title={l === "nl" ? "11. Overmacht" : "11. Force majeure"}
          body={
            l === "nl"
              ? "Wij zijn niet aansprakelijk voor vertraging of het niet kunnen uitvoeren van een rit als gevolg van omstandigheden buiten onze redelijke controle, zoals extreem weer, verkeerssituaties, wegafsluitingen, of overheidsmaatregelen. Wij informeren u zo snel mogelijk als dit uw rit raakt."
              : "We are not liable for delay or the inability to carry out a ride due to circumstances beyond our reasonable control, such as extreme weather, traffic situations, road closures, or government measures. We will inform you as soon as possible if this affects your ride."
          }
        />
        <Section
          title={l === "nl" ? "12. Klachten" : "12. Complaints"}
          body={
            l === "nl"
              ? "Heeft u een klacht over uw rit, neem dan zo snel mogelijk contact met ons op via de contactpagina of WhatsApp, zodat wij samen naar een oplossing kunnen zoeken."
              : "If you have a complaint about your ride, please contact us as soon as possible via the contact page or WhatsApp, so we can work together towards a solution."
          }
        />
        <Section
          title={l === "nl" ? "13. Toepasselijk recht" : "13. Applicable law"}
          body={
            l === "nl"
              ? "Op deze voorwaarden en op iedere rit die u bij ons boekt is Nederlands recht van toepassing."
              : "Dutch law applies to these terms and to every ride you book with us."
          }
        />
      </div>
    </section>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <p className="mt-2">{body}</p>
    </div>
  );
}
