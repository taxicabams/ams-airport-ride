import { findSchipholPrice, CANONICAL_ROUTE_FACTS } from "./pricing/staticRoutes";
import { estimateDistanceDuration } from "./pricing/fallback";
import { LOCATIONS } from "./locations";

const SCHIPHOL_LOCATION = LOCATIONS.find((l) => l.id === "schiphol")!;

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
        { q: "Hoe lang van tevoren moet ik boeken?", a: "Hoe eerder hoe beter, maar een taxi Schiphol Amsterdam kan doorgaans ook nog dezelfde dag online geboekt worden." },
        { q: "Rijdt u ook 's nachts?", a: "Ja, u kunt op elk moment van de dag of nacht een rit boeken, ook voor vroege vluchten en late aankomsten op Schiphol." },
      ],
      en: [
        { q: "How far in advance should I book?", a: "The sooner the better, but a Schiphol Amsterdam taxi can usually still be booked online the same day." },
        { q: "Do you also drive at night?", a: "Yes, you can book a ride online at any time of day or night, including for early flights and late arrivals at Schiphol." },
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
        { q: "Rijden jullie ook 's avonds laat of 's ochtends vroeg naar Amstelveen?", a: "Ja, u kunt op elk moment van de dag of nacht een rit van en naar Amstelveen boeken via de website." },
      ],
      en: [
        { q: "Is Amstelveen far from Schiphol?", a: "No, Amstelveen is very close to Schiphol — the ride typically takes about 15 minutes." },
        { q: "Do you also drive late at night or early in the morning to Amstelveen?", a: "Yes, you can book a ride to and from Amstelveen online at any time of day or night." },
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
    cityId: "hoofddorp",
    local: {
      nl: "Hoofddorp grenst direct aan Schiphol en is de hoofdplaats van de gemeente Haarlemmermeer — met veel internationale bedrijven en kantoren vlakbij de luchthaven. Dankzij de korte afstand is dit een van onze snelste ritten vanaf Schiphol.",
      en: "Hoofddorp borders Schiphol directly and is the main town of the Haarlemmermeer municipality, home to many international companies and offices close to the airport. Thanks to the short distance, this is one of our fastest rides from Schiphol.",
    },
    faq: {
      nl: [
        { q: "Hoe ver is Hoofddorp van Schiphol?", a: "Heel dichtbij — Hoofddorp grenst aan Schiphol, de rit duurt doorgaans maar een paar minuten." },
        { q: "Kan ik ook naar een kantoor in Hoofddorp?", a: "Ja, wij brengen u naar elk adres in Hoofddorp, zowel zakelijk als privé." },
      ],
      en: [
        { q: "How far is Hoofddorp from Schiphol?", a: "Very close — Hoofddorp borders Schiphol, so the ride usually only takes a few minutes." },
        { q: "Can you also take me to an office in Hoofddorp?", a: "Yes, we take you to any address in Hoofddorp, for business or personal trips." },
      ],
    },
  },
  {
    cityId: "zaandam",
    local: {
      nl: "Zaandam, onderdeel van de gemeente Zaanstad, is bekend van de kleurrijke Zaanse huisjes van het Inntel Hotel en ligt vlak bij de Zaanse Schans met zijn molens. De rit vanaf Schiphol loopt via de ring van Amsterdam.",
      en: "Zaandam, part of the Zaanstad municipality, is known for the colourful stacked-house design of the Inntel Hotel and sits right next to the Zaanse Schans windmills. The ride from Schiphol runs via the Amsterdam ring road.",
    },
    faq: {
      nl: [
        { q: "Rijdt u ook naar de Zaanse Schans?", a: "Ja, geef dit gewoon als bestemming op bij het boeken." },
        { q: "Hoe lang duurt de rit naar Zaandam vanaf Schiphol?", a: "Reken op ongeveer een half uur, afhankelijk van het verkeer op de ring van Amsterdam." },
      ],
      en: [
        { q: "Do you also drive to the Zaanse Schans?", a: "Yes, just enter it as your destination when booking." },
        { q: "How long does the ride to Zaandam from Schiphol take?", a: "Expect around half an hour, depending on traffic on the Amsterdam ring road." },
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
      nl: "Rotterdam is de verste van onze hoofdroutes vanaf Schiphol, populair bij zakelijke reizigers naar de Erasmus Universiteit, het havengebied en het centrum. Reken op ongeveer 55 minuten reistijd via de A4/A13.",
      en: "Rotterdam is the furthest of our main routes from Schiphol, popular with business travellers heading to Erasmus University, the port area, and the city centre. Expect roughly 55 minutes of travel time via the A4/A13.",
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
        { q: "Kan ik vroeg in de ochtend vertrekken?", a: "Ja, u kunt op elk moment boeken, ook voor vroege vluchten vanaf Schiphol." },
      ],
      en: [
        { q: "Do you also drive to Scheveningen?", a: "Yes, we also take you to Scheveningen and other parts of The Hague — just mention this when booking." },
        { q: "Can I depart early in the morning?", a: "Yes, you can book at any time, including for early flights from Schiphol." },
      ],
    },
  },
  {
    cityId: "aalsmeer",
    local: {
      nl: "Aalsmeer ligt vlak naast Schiphol en is wereldwijd bekend van de bloemenveiling van Royal FloraHolland, een van de grootste veilingcomplexen ter wereld. Door de korte afstand is dit een van de snelste ritten vanaf de luchthaven, ideaal voor zowel zakelijke bezoekers aan de veiling als reizigers die in Aalsmeer wonen.",
      en: "Aalsmeer sits right next to Schiphol and is known worldwide for the Royal FloraHolland flower auction, one of the largest auction complexes in the world. Thanks to the short distance, this is one of the fastest rides from the airport, ideal for both business visitors to the auction and residents of Aalsmeer.",
    },
    faq: {
      nl: [
        { q: "Hoe ver is Aalsmeer van Schiphol?", a: "Heel dichtbij — de rit duurt doorgaans maar zo'n 15-20 minuten." },
        { q: "Kan ik ook naar de bloemenveiling geboekt worden?", a: "Ja, geef het exacte adres van uw bestemming in Aalsmeer op bij het boeken." },
      ],
      en: [
        { q: "How far is Aalsmeer from Schiphol?", a: "Very close — the ride usually only takes about 15-20 minutes." },
        { q: "Can you also take me to the flower auction?", a: "Yes, just enter the exact address of your destination in Aalsmeer when booking." },
      ],
    },
  },
  {
    cityId: "diemen",
    local: {
      nl: "Diemen ligt tussen Schiphol en Amsterdam-Zuidoost in, vlak bij bedrijventerrein Verrijn Stuartweg en op korte afstand van de Amsterdam ArenA. Een populaire route voor zowel forenzen als bezoekers van evenementen in de buurt.",
      en: "Diemen sits between Schiphol and Amsterdam Southeast, close to the Verrijn Stuartweg business park and a short distance from the Amsterdam ArenA. A popular route for both commuters and visitors attending events nearby.",
    },
    faq: {
      nl: [
        { q: "Rijdt u ook naar een evenement in de Amsterdam ArenA?", a: "Ja, vermeld dit gewoon als bestemming bij het boeken, ook als het een adres vlak bij de ArenA is." },
        { q: "Hoe lang duurt de rit vanaf Schiphol naar Diemen?", a: "Doorgaans rond de 20-25 minuten, afhankelijk van het verkeer op de ring." },
      ],
      en: [
        { q: "Do you also drive to an event at the Amsterdam ArenA?", a: "Yes, just enter it as your destination when booking, even for an address close to the ArenA." },
        { q: "How long does the ride from Schiphol to Diemen take?", a: "Usually around 20-25 minutes, depending on traffic on the ring road." },
      ],
    },
  },
  {
    cityId: "uithoorn",
    local: {
      nl: "Uithoorn ligt aan de Amstel, ten zuiden van Amstelveen, en is onder meer bekend van de glastuinbouw rond De Kwakel. De rit vanaf Schiphol loopt via Amstelveen en duurt doorgaans zo'n 20-25 minuten.",
      en: "Uithoorn sits on the Amstel river, south of Amstelveen, and is known among other things for the greenhouse horticulture around De Kwakel. The ride from Schiphol runs via Amstelveen and usually takes about 20-25 minutes.",
    },
    faq: {
      nl: [
        { q: "Komt de chauffeur ook naar De Kwakel?", a: "Ja, we rijden naar elk adres binnen de gemeente Uithoorn, inclusief De Kwakel." },
        { q: "Is de prijs naar Uithoorn vast?", a: "Ja, u ziet de vaste prijs vooraf, ongeacht het verkeer onderweg." },
      ],
      en: [
        { q: "Do you also drive to De Kwakel?", a: "Yes, we drive to any address within the Uithoorn municipality, including De Kwakel." },
        { q: "Is the price to Uithoorn fixed?", a: "Yes, you see the fixed price upfront, regardless of traffic along the way." },
      ],
    },
  },
  {
    cityId: "leiden",
    local: {
      nl: "Leiden is een populaire universiteitsstad met een historische binnenstad vol grachten, dicht bij de Bollenstreek en Keukenhof. De rit vanaf Schiphol loopt via de A4 en duurt doorgaans ongeveer 30-35 minuten.",
      en: "Leiden is a popular university city with a historic canal-lined centre, close to the Bollenstreek bulb region and Keukenhof. The ride from Schiphol runs via the A4 and usually takes around 30-35 minutes.",
    },
    faq: {
      nl: [
        { q: "Kan de chauffeur mij afzetten in de binnenstad van Leiden?", a: "Ja, we brengen u tot voor de deur, ook in de historische binnenstad." },
        { q: "Rijdt u ook naar Keukenhof?", a: "Ja, geef dit gewoon als bestemming op bij het boeken." },
      ],
      en: [
        { q: "Can the driver drop me off in Leiden's city centre?", a: "Yes, we drop you off right at the door, including in the historic centre." },
        { q: "Do you also drive to Keukenhof?", a: "Yes, just enter it as your destination when booking." },
      ],
    },
  },
  {
    cityId: "almere-stad",
    local: {
      nl: "Almere Stad, het centrum van de jongste grote stad van Nederland, groeit snel als woon- en werkplek in de regio Amsterdam. De rit vanaf Schiphol loopt via de A1/A6 over het IJmeer en duurt doorgaans ongeveer 40-45 minuten.",
      en: "Almere Stad, the centre of the Netherlands' youngest major city, is a fast-growing place to live and work in the greater Amsterdam region. The ride from Schiphol runs via the A1/A6 over the IJmeer and usually takes around 40-45 minutes.",
    },
    faq: {
      nl: [
        { q: "Hoe lang duurt de rit van Schiphol naar Almere?", a: "Reken op ongeveer 40-45 minuten, afhankelijk van het verkeer." },
        { q: "Rijdt u ook naar andere delen van Almere, zoals Almere Buiten?", a: "Ja, geef het exacte adres op bij het boeken, ongeacht in welk deel van Almere het ligt." },
      ],
      en: [
        { q: "How long does the ride from Schiphol to Almere take?", a: "Expect around 40-45 minutes, depending on traffic." },
        { q: "Do you also drive to other parts of Almere, such as Almere Buiten?", a: "Yes, just enter the exact address when booking, wherever in Almere it is." },
      ],
    },
  },
  {
    cityId: "hilversum",
    local: {
      nl: "Hilversum, bekend als mediastad met onder meer het hoofdkantoor van de publieke omroep, ligt centraal in het Gooi. De rit vanaf Schiphol loopt via de A9/A1 en duurt doorgaans ongeveer 35-40 minuten.",
      en: "Hilversum, known as the Netherlands' media city and home to the national public broadcaster's headquarters, sits centrally in the Gooi region. The ride from Schiphol runs via the A9/A1 and usually takes around 35-40 minutes.",
    },
    faq: {
      nl: [
        { q: "Rijdt u ook naar de mediabedrijven in Hilversum?", a: "Ja, we brengen u naar elk zakelijk of privéadres in Hilversum." },
        { q: "Hoe lang van tevoren moet ik boeken voor Hilversum?", a: "Hoe eerder hoe beter, maar een rit naar Hilversum kan doorgaans ook dezelfde dag nog geboekt worden." },
      ],
      en: [
        { q: "Do you also drive to the media companies in Hilversum?", a: "Yes, we take you to any business or personal address in Hilversum." },
        { q: "How far in advance should I book for Hilversum?", a: "The sooner the better, but a ride to Hilversum can usually still be booked the same day." },
      ],
    },
  },
  {
    cityId: "amersfoort",
    local: {
      nl: "Amersfoort combineert een historische binnenstad rond de Koppelpoort met een groeiend aantal kantoren en bedrijven, centraal gelegen in Nederland. De rit vanaf Schiphol duurt doorgaans ongeveer 50-55 minuten via de A1.",
      en: "Amersfoort combines a historic centre around the Koppelpoort gate with a growing number of offices and companies, centrally located in the Netherlands. The ride from Schiphol usually takes around 50-55 minutes via the A1.",
    },
    faq: {
      nl: [
        { q: "Is Amersfoort ver van Schiphol?", a: "Het ligt centraal in Nederland — reken op ongeveer 50-55 minuten reistijd." },
        { q: "Kan ik ook 's avonds laat naar Amersfoort boeken?", a: "Ja, u kunt op elk moment van de dag of nacht een rit boeken." },
      ],
      en: [
        { q: "Is Amersfoort far from Schiphol?", a: "It sits centrally in the Netherlands — expect roughly 50-55 minutes of travel time." },
        { q: "Can I also book a ride to Amersfoort late in the evening?", a: "Yes, you can book a ride at any time of day or night." },
      ],
    },
  },
  {
    cityId: "de-aker-badhoevedorp",
    local: {
      nl: "Badhoevedorp en de Amsterdamse wijk De Aker liggen direct naast Schiphol, gescheiden door slechts de A4/A9. Dankzij deze korte afstand is dit een van onze snelste ritten vanaf de luchthaven.",
      en: "Badhoevedorp and the Amsterdam De Aker neighbourhood sit right next to Schiphol, separated only by the A4/A9 motorway. Thanks to this short distance, this is one of our fastest rides from the airport.",
    },
    faq: {
      nl: [
        { q: "Hoe ver is Badhoevedorp van Schiphol?", a: "Heel dichtbij — Badhoevedorp grenst praktisch aan Schiphol, de rit duurt doorgaans maar een paar minuten." },
        { q: "Rijdt u ook naar De Aker?", a: "Ja, wij brengen u naar elk adres in De Aker en Badhoevedorp, zowel zakelijk als privé." },
      ],
      en: [
        { q: "How far is Badhoevedorp from Schiphol?", a: "Very close — Badhoevedorp practically borders Schiphol, so the ride usually only takes a few minutes." },
        { q: "Do you also drive to De Aker?", a: "Yes, we take you to any address in De Aker and Badhoevedorp, for business or personal trips." },
      ],
    },
  },
  {
    cityId: "heemstede",
    local: {
      nl: "Heemstede grenst direct aan Haarlem en combineert een rustige, groene woonomgeving met een eigen compact centrum. De rit vanaf Schiphol loopt via de A9/A5, net als naar Haarlem.",
      en: "Heemstede borders Haarlem directly and combines a quiet, green residential area with its own compact town centre. The ride from Schiphol runs via the A9/A5, similar to the route to Haarlem.",
    },
    faq: {
      nl: [
        { q: "Is Heemstede ver van Schiphol?", a: "Nee, Heemstede ligt vlak bij Haarlem — de rit vanaf Schiphol is vergelijkbaar met die naar Haarlem." },
        { q: "Kan ik ook naar een adres net buiten het centrum van Heemstede?", a: "Ja, wij brengen u naar elk adres in Heemstede, ook buiten het centrum." },
      ],
      en: [
        { q: "Is Heemstede far from Schiphol?", a: "No, Heemstede sits right next to Haarlem — the ride from Schiphol is similar to the one to Haarlem." },
        { q: "Can you also take me to an address just outside Heemstede's centre?", a: "Yes, we take you to any address in Heemstede, including outside the town centre." },
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
  // Price comes from the shared Schiphol price list (so it's always the
  // same number the booking widget would quote); distance/duration come
  // from CANONICAL_ROUTE_FACTS, the small hand-researched dataset kept
  // for the original 6 pages — see staticRoutes.ts. Cities added later
  // (Hoofddorp, Zaandam) fall back to the same real, coordinate-based
  // haversine formula RouteList.tsx already uses for the same reason
  // (no hand-research done yet), rather than leaving this crash on a
  // missing lookup or inventing a number.
  const basePrice = findSchipholPrice(content.cityId)!;
  const cityLocation = LOCATIONS.find((l) => l.id === content.cityId);
  const { distanceKm, durationMin } =
    CANONICAL_ROUTE_FACTS[content.cityId] ?? estimateDistanceDuration(SCHIPHOL_LOCATION, cityLocation);

  return [
    {
      slug: `taxi-schiphol-${content.cityId}`,
      originId: "schiphol",
      destinationId: content.cityId,
      cityId: content.cityId,
      direction: "from-schiphol" as const,
      basePrice,
      distanceKm,
      durationMin,
      content,
    },
    {
      slug: `taxi-${content.cityId}-schiphol`,
      originId: content.cityId,
      destinationId: "schiphol",
      cityId: content.cityId,
      direction: "to-schiphol" as const,
      basePrice,
      distanceKm,
      durationMin,
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
