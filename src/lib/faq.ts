import {
  PERSONENAUTO_MAX_PASSENGERS,
  BUS_MAX_PASSENGERS,
  BUS_MAX_LUGGAGE,
} from "./pricing/vehicle";

export const GENERAL_FAQ: Record<"nl" | "en", { q: string; a: string }[]> = {
  nl: [
    {
      q: "Hoe wordt mijn prijs bepaald?",
      a: "U vult uw ophaaladres, bestemming, datum, tijd, passagiers en bagage in. Voordat u hoeft te boeken, ziet u al een duidelijke totaalprijs. Voor ritten van of naar Schiphol is dit een vaste prijs; voor andere ritten wordt de prijs berekend op basis van de afstand en reistijd. In beide gevallen staat het bedrag vast zodra u boekt en verandert het niet meer, ook niet bij drukte onderweg.",
    },
    {
      q: "Wanneer betaal ik?",
      a: "Pas na de rit, rechtstreeks bij de chauffeur, met PIN of contant. U hoeft bij het boeken niets online te betalen.",
    },
    {
      q: "Hoe vind ik mijn chauffeur op Schiphol?",
      a: "Uw chauffeur staat op Schiphol op u te wachten nadat u door de douane bent en neemt telefonisch of per sms contact met u op om de exacte plek af te spreken — meestal bij het Meeting Point op Schiphol Plaza.",
    },
    {
      q: "Boekt AMS Airport Ride ook ritten die niets met Schiphol te maken hebben?",
      a: "Ja. Naast Schiphol-transfers boeken wij ook gewone taxiritten binnen Amsterdam zelf — bijvoorbeeld van huis naar werk, station, hotel of restaurant — én privéritten tussen Nederlandse steden, bijvoorbeeld Amsterdam ↔ Utrecht of Amsterdam ↔ Rotterdam.",
    },
    {
      q: "Wat als mijn vlucht vertraging heeft?",
      a: "Vul uw vluchtnummer in bij het boeken, dan houden wij hier rekening mee, zodat uw chauffeur ook bij vertraging voor u klaarstaat.",
    },
    {
      q: "Wat kost een taxi van Amsterdam naar Schiphol?",
      a: "Voor Amsterdam geldt een vaste prijs vanaf €45, afhankelijk van de precieze wijk. Vul uw ophaaladres en Schiphol als bestemming in bij de calculator om direct uw exacte vaste prijs te zien.",
    },
    {
      q: "Krijg ik een bon?",
      a: "Ja, een bon is beschikbaar in de taxi. Vraag hier gerust naar bij uw chauffeur.",
    },
    {
      q: "Kan ik een retourrit boeken?",
      a: "Ja. Zet bij het boeken de optie 'Retour' aan en vul uw retourdatum en -tijd in — u ziet dan direct de totaalprijs voor de heenrit én de retourrit samen.",
    },
    {
      q: "Kan ik voor iemand anders boeken?",
      a: "Ja, dat kan. Vul bij de boeking gewoon de naam en het telefoonnummer van de reiziger zelf in, zodat de chauffeur die persoon kan bereiken.",
    },
    {
      q: "Kan ik met meerdere personen en veel bagage reizen?",
      a: `Zeker. Onze Personenauto biedt plaats aan tot ${PERSONENAUTO_MAX_PASSENGERS} passagiers. Heeft u meer passagiers of bagage nodig, dan selecteren wij automatisch de Bus / 7-persoons, met plaats voor tot ${BUS_MAX_PASSENGERS} passagiers en ${BUS_MAX_LUGGAGE} koffers.`,
    },
  ],
  en: [
    {
      q: "How is my price determined?",
      a: "You enter your pickup address, destination, date, time, passengers and luggage. Before you book anything, you already see a clear total price. For rides to or from Schiphol this is a fixed price; for other rides the price is calculated based on distance and travel time. Either way, the amount is locked in once you book and doesn't change afterwards, not even in heavy traffic.",
    },
    {
      q: "When do I pay?",
      a: "Only after your ride, directly with the driver, by card or cash. You don't pay anything online when booking.",
    },
    {
      q: "How do I find my driver at Schiphol?",
      a: "Your driver will be waiting for you at Schiphol after you clear customs and will contact you by phone or text to confirm the exact meeting spot — usually near the Meeting Point at Schiphol Plaza.",
    },
    {
      q: "Does AMS Airport Ride also book rides that have nothing to do with Schiphol?",
      a: "Yes. Besides Schiphol transfers, we also book regular taxi rides within Amsterdam itself — for example from home to work, the station, a hotel or a restaurant — as well as private rides between Dutch cities, for example Amsterdam ↔ Utrecht or Amsterdam ↔ Rotterdam.",
    },
    {
      q: "What if my flight is delayed?",
      a: "Add your flight number when booking, so we can take it into account and your driver is ready for you even if it's delayed.",
    },
    {
      q: "How much is a taxi from Amsterdam to Schiphol?",
      a: "For Amsterdam, a fixed price from €45 applies, depending on the exact neighborhood. Enter your pickup address and Schiphol as your destination in the calculator to see your exact fixed price right away.",
    },
    {
      q: "Do I receive a receipt?",
      a: "Yes, a receipt is available in the taxi. Feel free to ask your driver for one.",
    },
    {
      q: "Can I book a return trip?",
      a: "Yes. Turn on the 'Return' option when booking and enter your return date and time — you'll immediately see the total price for the outbound and return trip together.",
    },
    {
      q: "Can I book for someone else?",
      a: "Yes, that's fine. Just enter the traveller's own name and phone number when booking, so the driver can reach that person directly.",
    },
    {
      q: "Can I travel with several passengers and luggage?",
      a: `Absolutely. Our Sedan seats up to ${PERSONENAUTO_MAX_PASSENGERS} passengers. If you need more passengers or luggage space, we automatically select the Van / 7-seater, with room for up to ${BUS_MAX_PASSENGERS} passengers and ${BUS_MAX_LUGGAGE} bags.`,
    },
  ],
};
