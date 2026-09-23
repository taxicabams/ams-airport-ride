import { STATIC_ROUTES } from "./pricing/staticRoutes";
import { LOCATIONS } from "./locations";

/**
 * Content for the hand-authored Schiphol route pages. Deliberately NOT a
 * thin template: each city has its own hand-written paragraph about the
 * actual pickup/local context (not just "book your taxi to X"), plus its
 * own FAQ entries, in both languages. Price/distance/duration come from
 * staticRoutes.ts (the same numbers the booking widget quotes) so the
 * article and the calculator can never disagree.
 */
type Locale = "nl" | "en";

type CityContent = {
  cityId: string;
  faq: Record<Locale, { q: string; a: string }[]>;
  local: Record<Locale, string>;
};

const CITY_CONTENT: CityContent[] = [
  {
    cityId: "amsterdam",
    local: {
      nl: "Amsterdam ligt vlak bij Schiphol, maar het drukke centrum (grachtengordel, Museumplein, Amsterdam Centraal) is met de auto soms lastig bereikbaar door eenrichtingsverkeer en milieuzones. Onze chauffeurs kennen de kortste routes naar elk hotel of adres in de stad, ook tijdens de spits.",
      en: "Amsterdam sits right next to Schiphol, but the busy city centre (the canal ring, Museumplein, Amsterdam Centraal) can be tricky to reach by car due to one-way streets and low-emission zones. Our drivers know the fastest way to any hotel or address in the city, even during rush hour.",
    },
    faq: {
      nl: [
        { q: "Hoe lang van tevoren moet ik boeken?", a: "Hoe eerder hoe beter, maar een taxi Schiphol Amsterdam kan doorgaans ook nog dezelfde dag geboekt worden — bel of app ons voor last-minute ritten." },
        { q: "Rijdt u ook 's nachts?", a: "Ja, we zijn 24/7 beschikbaar voor vroege vluchten en late aankomsten op Schiphol." },
      ],
      en: [
        { q: "How far in advance should I book?", a: "The sooner the better, but a Schiphol Amsterdam taxi can usually still be booked the same day — call or WhatsApp us for last-minute rides." },
        { q: "Do you also drive at night?", a: "Yes, we're available 24/7 for early flights and late arrivals at Schiphol." },
      ],
    },
  },
  {
    cityId: "amstelveen",
    local: {
      nl: "Amstelveen is dankzij de nabijheid van Schiphol populair bij zakelijke reizigers en internationale bedrijven op bedrijventerrein Kronenburg en rond het Stadshart. De rit vanaf Schiphol duurt doorgaans niet langer dan een kwartier.",
      en: "Thanks to its proximity to Schiphol, Amstelveen is popular with business travellers and international companies around the Kronenburg business park and Stadshart. The ride from Schiphol usually takes no more than fifteen minutes.",
    },
    faq: {
      nl: [
        { q: "Is Amstelveen ver van Schiphol?", a: "Nee, Amstelveen ligt vlak bij Schiphol — de rit duurt doorgaans ongeveer 15 minuten." },
        { q: "Kan ik een zakelijke rit op factuur boeken?", a: "Neem contact met ons op voor zakelijke boekingen en facturatie." },
      ],
      en: [
        { q: "Is Amstelveen far from Schiphol?", a: "No, Amstelveen is very close to Schiphol — the ride typically takes about 15 minutes." },
        { q: "Can I book a business ride on invoice?", a: "Contact us directly for business bookings and invoicing." },
      ],
    },
  },
  {
    cityId: "haarlem",
    local: {
      nl: "Haarlem is een van de dichtstbijzijnde grote steden bij Schiphol en populair bij toeristen vanwege de historische binnenstad. De route loopt via de A9/N201 en is meestal binnen 20 minuten te rijden.",
      en: "Haarlem is one of the closest larger cities to Schiphol and popular with tourists for its historic city centre. The route runs via the A9/N201 and usually takes under 20 minutes.",
    },
    faq: {
      nl: [
        { q: "Stopt de chauffeur bij mijn hotel in de binnenstad?", a: "Ja, we brengen u tot voor de deur, ook in de historische binnenstad van Haarlem." },
        { q: "Wat kost een taxi Schiphol Haarlem?", a: "Wij hanteren een vaste prijs die u vooraf ziet — geen verrassingen achteraf." },
      ],
      en: [
        { q: "Will the driver stop right at my hotel in the city centre?", a: "Yes, we drop you off right at the door, including in Haarlem's historic centre." },
        { q: "What does a Schiphol Haarlem taxi cost?", a: "We use a fixed price that you see upfront — no surprises afterwards." },
      ],
    },
  },
  {
    cityId: "utrecht",
    local: {
      nl: "Utrecht ligt centraal in Nederland en is populair bij zowel toeristen als zakelijke reizigers rond Utrecht Centraal en de Uithof/Utrecht Science Park. Reken op ongeveer 45-55 minuten reistijd vanaf Schiphol, afhankelijk van het verkeer op de A2.",
      en: "Utrecht sits centrally in the Netherlands and is popular with both tourists and business travellers around Utrecht Centraal and Utrecht Science Park. Expect roughly 45-55 minutes of travel time from Schiphol, depending on traffic on the A2.",
    },
    faq: {
      nl: [
        { q: "Is de rit naar Utrecht duurder dan naar Amsterdam?", a: "Ja, Utrecht ligt verder van Schiphol, dus de vaste prijs ligt hoger dan bijvoorbeeld naar Amsterdam of Amstelveen — u ziet het exacte bedrag vooraf." },
        { q: "Kan ik onderweg een tussenstop maken?", a: "Neem dit op in de opmerkingen bij het boeken, dan bespreken we de mogelijkheden." },
      ],
      en: [
        { q: "Is the ride to Utrecht more expensive than to Amsterdam?", a: "Yes, Utrecht is further from Schiphol, so the fixed price is higher than, say, Amsterdam or Amstelveen — you'll see the exact amount upfront." },
        { q: "Can I make a stop along the way?", a: "Add this in the notes when booking and we'll discuss the options." },
      ],
    },
  },
  {
    cityId: "rotterdam",
    local: {
      nl: "Rotterdam is de verste van onze zes hoofdroutes vanaf Schiphol, populair bij zakelijke reizigers naar de Erasmus Universiteit, het havengebied en het centrum. Reken op ongeveer 55 minuten reistijd via de A4/A13.",
      en: "Rotterdam is the furthest of our six main routes from Schiphol, popular with business travellers heading to Erasmus University, the port area, and the city centre. Expect roughly 55 minutes of travel time via the A4/A13.",
    },
    faq: {
      nl: [
        { q: "Rijdt u ook naar Rotterdam The Hague Airport?", a: "Onze focus ligt op Schiphol, maar neem gerust contact op voor andere luchthavens." },
        { q: "Is de prijs naar Rotterdam vast, ook in de spits?", a: "Ja, de vaste prijs die u vooraf ziet verandert niet door drukte onderweg." },
      ],
      en: [
        { q: "Do you also drive to Rotterdam The Hague Airport?", a: "Our focus is on Schiphol, but feel free to contact us about other airports." },
        { q: "Is the price to Rotterdam fixed, even during rush hour?", a: "Yes, the fixed price you see upfront doesn't change because of traffic along the way." },
      ],
    },
  },
  {
    cityId: "den-haag",
    local: {
      nl: "Den Haag is de regeringszetel van Nederland en bekend om ambassades, ministeries en internationale organisaties zoals het Internationaal Gerechtshof — regelmatige bestemmingen voor onze zakelijke klanten. Reken op ongeveer 40-45 minuten reistijd vanaf Schiphol.",
      en: "The Hague is the seat of the Dutch government and home to embassies, ministries, and international organisations such as the International Court of Justice — frequent destinations for our business clients. Expect roughly 40-45 minutes of travel time from Schiphol.",
    },
    faq: {
      nl: [
        { q: "Rijdt u ook naar Scheveningen?", a: "Ja, we brengen u ook naar Scheveningen en andere delen van de gemeente Den Haag — vermeld dit gewoon bij het boeken." },
        { q: "Kan ik vroeg in de ochtend vertrekken?", a: "Ja, we zijn 24/7 beschikbaar, ook voor vroege vluchten vanaf Schiphol." },
      ],
      en: [
        { q: "Do you also drive to Scheveningen?", a: "Yes, we also take you to Scheveningen and other parts of The Hague — just mention this when booking." },
        { q: "Can I depart early in the morning?", a: "Yes, we're available 24/7, including for early flights from Schiphol." },
      ],
    },
  },
];

export type RoutePage = {
  slug: string;
  originId: string;
  destinationId: string;
  cityId: string;
  direction: "from-schiphol" | "to-schiphol";
  basePrice: number;
  distanceKm: number;
  durationMin: number;
  content: CityContent;
};

function cityLabel(cityId: string, locale: Locale): string {
  return LOCATIONS.find((l) => l.id === cityId)?.label[locale] ?? cityId;
}

export const ROUTE_PAGES: RoutePage[] = CITY_CONTENT.flatMap((content) => {
  const route = Object.values(STATIC_ROUTES).find(
    (r) => r.key === [content.cityId, "schiphol"].sort().join("|")
  )!;

  return [
    {
      slug: `taxi-schiphol-${content.cityId}`,
      originId: "schiphol",
      destinationId: content.cityId,
      cityId: content.cityId,
      direction: "from-schiphol" as const,
      basePrice: route.basePrice,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
      content,
    },
    {
      slug: `taxi-${content.cityId}-schiphol`,
      originId: content.cityId,
      destinationId: "schiphol",
      cityId: content.cityId,
      direction: "to-schiphol" as const,
      basePrice: route.basePrice,
      distanceKm: route.distanceKm,
      durationMin: route.durationMin,
      content,
    },
  ];
});

export function getRoutePage(slug: string): RoutePage | undefined {
  return ROUTE_PAGES.find((r) => r.slug === slug);
}

export function routePageCopy(route: RoutePage, locale: Locale) {
  const city = cityLabel(route.cityId, locale);
  const fromSchiphol = route.direction === "from-schiphol";

  const title =
    locale === "nl"
      ? fromSchiphol
        ? `Taxi Schiphol naar ${city} — vaste prijs`
        : `Taxi ${city} naar Schiphol — vaste prijs`
      : fromSchiphol
        ? `Schiphol Taxi to ${city} — Fixed Price`
        : `Taxi ${city} to Schiphol — Fixed Price`;

  const description =
    locale === "nl"
      ? `Boek uw taxi ${fromSchiphol ? `van Schiphol naar ${city}` : `van ${city} naar Schiphol`} met een vaste prijs van €${route.basePrice}. Rijtijd ca. ${route.durationMin} minuten. Betaal na de rit.`
      : `Book your taxi ${fromSchiphol ? `from Schiphol to ${city}` : `from ${city} to Schiphol`} with a fixed price of €${route.basePrice}. Travel time approx. ${route.durationMin} minutes. Pay after your ride.`;

  const intro =
    locale === "nl"
      ? fromSchiphol
        ? `Zoekt u een betrouwbare taxi van Schiphol naar ${city}? Met AMS Airport Ride weet u vooraf precies wat u betaalt: €${route.basePrice} vast, voor een rit van ongeveer ${route.distanceKm} km en ${route.durationMin} minuten. Uw chauffeur staat klaar zodra u door de douane bent.`
        : `Op weg naar Schiphol vanuit ${city}? Boek uw taxi ${city} Schiphol met een vaste prijs van €${route.basePrice} — geen meterprijs, geen verrassingen. Wij houden rekening met uw vertrektijd zodat u ruim op tijd bij de incheckbalie bent.`
      : fromSchiphol
        ? `Looking for a reliable taxi from Schiphol to ${city}? With AMS Airport Ride you know exactly what you'll pay upfront: a fixed €${route.basePrice} for a ride of about ${route.distanceKm} km and ${route.durationMin} minutes. Your driver is ready as soon as you clear customs.`
        : `Heading to Schiphol from ${city}? Book your ${city} Schiphol taxi with a fixed price of €${route.basePrice} — no meter, no surprises. We plan around your departure time so you reach check-in with plenty of time to spare.`;

  return { title, description, intro, city };
}
