import {
  PERSONENAUTO_MAX_PASSENGERS,
  PERSONENAUTO_MAX_LUGGAGE,
  BUS_MAX_PASSENGERS,
  BUS_MAX_LUGGAGE,
} from "./pricing/vehicle";
import { CHEAPEST_SCHIPHOL_PRICE } from "./pricing/staticRoutes";

/**
 * v10 rebuild — trimmed/reordered to the client's exact new list of 10
 * questions for the homepage FAQ (was a slightly different 10 before).
 * Every answer below is either reused verbatim from the previous list
 * or newly written from the same real facts (pricing constants, the
 * existing payment/return/flight-delay policy) — nothing invented. The
 * two dropped questions ("Hoe vind ik mijn chauffeur op Schiphol?",
 * "Kan ik voor iemand anders boeken?") aren't lost: the first's content
 * now lives in the homepage's Schiphol banner card (TwoColumnBanner),
 * the second was a minor edge case not on the client's new list.
 */
export const GENERAL_FAQ: Record<"nl" | "en", { q: string; a: string }[]> = {
  nl: [
    {
      q: "Wat kost een taxi van Schiphol naar Amsterdam?",
      a: `Voor Amsterdam geldt een vaste prijs vanaf €${CHEAPEST_SCHIPHOL_PRICE}, afhankelijk van de precieze wijk. Vul uw adres en Schiphol in bij de calculator om direct uw exacte vaste prijs te zien — dezelfde prijs geldt in beide richtingen.`,
    },
    {
      q: "Is de Schiphol-prijs vooraf vast?",
      a: "Ja. Voor ritten van en naar Schiphol hanteren wij een vaste prijs die u al voor het boeken ziet — geen taxameter, geen verrassingen achteraf.",
    },
    {
      q: "Kan ik contant betalen?",
      a: "Ja, u betaalt na de rit rechtstreeks aan de chauffeur, contant of met PIN.",
    },
    {
      q: "Kan ik met PIN betalen?",
      a: "Ja, PIN wordt ook geaccepteerd. U hoeft bij het boeken niets online te betalen.",
    },
    {
      q: "Kan ik een retourrit boeken?",
      a: "Ja. Zet bij het boeken de optie 'Retour' aan en vul uw retourdatum en -tijd in — u ziet dan direct de totaalprijs voor de heenrit én de retourrit samen.",
    },
    {
      q: "Kan ik een taxi voor meerdere personen boeken?",
      a: `Zeker. Onze Comfort biedt plaats aan tot ${PERSONENAUTO_MAX_PASSENGERS} passagiers. Heeft u meer passagiers nodig, dan selecteren wij automatisch de Van, met plaats voor tot ${BUS_MAX_PASSENGERS} passagiers.`,
    },
    {
      q: "Hoeveel bagage kan ik meenemen?",
      a: `Comfort biedt plaats voor tot ${PERSONENAUTO_MAX_LUGGAGE} koffers. Heeft u meer bagage nodig, dan selecteren wij automatisch de Van, met plaats voor tot ${BUS_MAX_LUGGAGE} koffers.`,
    },
    {
      q: "Kan ik ook een normale taxi in Amsterdam boeken?",
      a: "Ja. Naast Schiphol-transfers boeken wij ook gewone taxiritten binnen Amsterdam zelf — bijvoorbeeld van huis naar werk, station, hotel of restaurant — én privéritten tussen Nederlandse steden, bijvoorbeeld Amsterdam ↔ Utrecht of Amsterdam ↔ Rotterdam.",
    },
    {
      q: "Wat gebeurt er als mijn vlucht vertraging heeft?",
      a: "Vul uw vluchtnummer in bij het boeken, dan houden wij hier rekening mee, zodat uw chauffeur ook bij vertraging voor u klaarstaat.",
    },
    {
      q: "Hoe ontvang ik mijn reserveringsbevestiging?",
      a: "Direct na het boeken ziet u een bevestiging met al uw ritgegevens op het scherm, en ontvangt u deze ook per e-mail. Heeft u toch niets ontvangen, neem dan gerust contact met ons op.",
    },
  ],
  en: [
    {
      q: "How much is a taxi from Schiphol to Amsterdam?",
      a: `For Amsterdam, a fixed price from €${CHEAPEST_SCHIPHOL_PRICE} applies, depending on the exact neighborhood. Enter your address and Schiphol in the calculator to see your exact fixed price right away — the same price applies in both directions.`,
    },
    {
      q: "Is the Schiphol price fixed in advance?",
      a: "Yes. For rides to and from Schiphol we use a fixed price you already see before booking — no meter, no surprises afterwards.",
    },
    {
      q: "Can I pay cash?",
      a: "Yes, you pay after your ride directly to the driver, by cash or card.",
    },
    {
      q: "Can I pay by card?",
      a: "Yes, card payment is accepted too. You don't pay anything online when booking.",
    },
    {
      q: "Can I book a return trip?",
      a: "Yes. Turn on the 'Return' option when booking and enter your return date and time — you'll immediately see the total price for the outbound and return trip together.",
    },
    {
      q: "Can I book a taxi for several people?",
      a: `Absolutely. Our Comfort seats up to ${PERSONENAUTO_MAX_PASSENGERS} passengers. If you need more, we automatically select the Van, with room for up to ${BUS_MAX_PASSENGERS} passengers.`,
    },
    {
      q: "How much luggage can I bring?",
      a: `Comfort has room for up to ${PERSONENAUTO_MAX_LUGGAGE} suitcases. If you need more space, we automatically select the Van, with room for up to ${BUS_MAX_LUGGAGE} suitcases.`,
    },
    {
      q: "Can I also book a regular taxi in Amsterdam?",
      a: "Yes. Besides Schiphol transfers, we also book regular taxi rides within Amsterdam itself — for example from home to work, the station, a hotel or a restaurant — as well as private rides between Dutch cities, for example Amsterdam ↔ Utrecht or Amsterdam ↔ Rotterdam.",
    },
    {
      q: "What happens if my flight is delayed?",
      a: "Add your flight number when booking, so we can take it into account and your driver is ready for you even if it's delayed.",
    },
    {
      q: "How do I receive my booking confirmation?",
      a: "Right after booking you'll see a confirmation with all your ride details on screen, and you'll also receive it by email. If you haven't received anything, feel free to contact us.",
    },
  ],
};
