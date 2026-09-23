/**
 * Curated locations for v1.
 *
 * We don't have Google Places yet (that's a deliberate Phase 2 addition —
 * see the plan), so pickup/destination fields are free-text inputs backed
 * by this list as native browser autocomplete suggestions (a <datalist>,
 * no JS library needed). The same list is what the pricing engine and
 * ride-type detector match free-text input against: we normalize what the
 * customer typed and look for the closest known place here.
 *
 * `isAirport` drives ride-type detection (see rideType.ts): if either
 * pickup or destination resolves to a location with isAirport: true,
 * the booking becomes an airport_transfer.
 *
 * Coordinates are approximate city-centre points, only precise enough for
 * the fallback distance formula in lib/pricing/fallback.ts — not for
 * turn-by-turn routing.
 */
export type Location = {
  id: string;
  label: { nl: string; en: string };
  /** Extra strings that should also match this location in free text. */
  aliases: string[];
  lat: number;
  lng: number;
  isAirport: boolean;
};

export const LOCATIONS: Location[] = [
  {
    id: "schiphol",
    label: { nl: "Schiphol Airport", en: "Schiphol Airport" },
    // Deliberately NOT "amsterdam airport" / "ams airport" — those
    // aliases contain the word "amsterdam" and, even with word-boundary
    // matching, would risk shadowing plain "Amsterdam" (the city) input.
    aliases: ["schiphol", "schiphol airport", "luchthaven schiphol", "ams"],
    lat: 52.3105,
    lng: 4.7683,
    isAirport: true,
  },
  { id: "amsterdam", label: { nl: "Amsterdam", en: "Amsterdam" }, aliases: ["amsterdam", "a'dam"], lat: 52.3676, lng: 4.9041, isAirport: false },
  { id: "amstelveen", label: { nl: "Amstelveen", en: "Amstelveen" }, aliases: ["amstelveen"], lat: 52.3114, lng: 4.8646, isAirport: false },
  { id: "haarlem", label: { nl: "Haarlem", en: "Haarlem" }, aliases: ["haarlem"], lat: 52.3874, lng: 4.6462, isAirport: false },
  { id: "utrecht", label: { nl: "Utrecht", en: "Utrecht" }, aliases: ["utrecht"], lat: 52.0907, lng: 5.1214, isAirport: false },
  { id: "rotterdam", label: { nl: "Rotterdam", en: "Rotterdam" }, aliases: ["rotterdam"], lat: 51.9244, lng: 4.4777, isAirport: false },
  { id: "den-haag", label: { nl: "Den Haag", en: "The Hague" }, aliases: ["den haag", "'s-gravenhage", "the hague", "s gravenhage"], lat: 52.0705, lng: 4.3007, isAirport: false },
  { id: "leiden", label: { nl: "Leiden", en: "Leiden" }, aliases: ["leiden"], lat: 52.1601, lng: 4.4970, isAirport: false },
  { id: "hoofddorp", label: { nl: "Hoofddorp", en: "Hoofddorp" }, aliases: ["hoofddorp"], lat: 52.3025, lng: 4.6889, isAirport: false },
  { id: "aalsmeer", label: { nl: "Aalsmeer", en: "Aalsmeer" }, aliases: ["aalsmeer"], lat: 52.2644, lng: 4.7554, isAirport: false },
  { id: "hilversum", label: { nl: "Hilversum", en: "Hilversum" }, aliases: ["hilversum"], lat: 52.2292, lng: 5.1669, isAirport: false },
  { id: "almere", label: { nl: "Almere", en: "Almere" }, aliases: ["almere"], lat: 52.3508, lng: 5.2647, isAirport: false },
  { id: "zaandam", label: { nl: "Zaandam", en: "Zaandam" }, aliases: ["zaandam", "zaanstad"], lat: 52.4389, lng: 4.8262, isAirport: false },
  { id: "delft", label: { nl: "Delft", en: "Delft" }, aliases: ["delft"], lat: 52.0116, lng: 4.3571, isAirport: false },
  { id: "gouda", label: { nl: "Gouda", en: "Gouda" }, aliases: ["gouda"], lat: 52.0115, lng: 4.7104, isAirport: false },
  { id: "alphen-aan-den-rijn", label: { nl: "Alphen aan den Rijn", en: "Alphen aan den Rijn" }, aliases: ["alphen aan den rijn", "alphen"], lat: 52.1290, lng: 4.6576, isAirport: false },
  { id: "amersfoort", label: { nl: "Amersfoort", en: "Amersfoort" }, aliases: ["amersfoort"], lat: 52.1561, lng: 5.3878, isAirport: false },
  { id: "eindhoven", label: { nl: "Eindhoven", en: "Eindhoven" }, aliases: ["eindhoven"], lat: 51.4416, lng: 5.4697, isAirport: false },
  { id: "breda", label: { nl: "Breda", en: "Breda" }, aliases: ["breda"], lat: 51.5719, lng: 4.7683, isAirport: false },
  { id: "tilburg", label: { nl: "Tilburg", en: "Tilburg" }, aliases: ["tilburg"], lat: 51.5555, lng: 5.0913, isAirport: false },
  { id: "s-hertogenbosch", label: { nl: "'s-Hertogenbosch", en: "'s-Hertogenbosch" }, aliases: ["den bosch", "'s-hertogenbosch", "s hertogenbosch"], lat: 51.6978, lng: 5.3037, isAirport: false },
  { id: "nijmegen", label: { nl: "Nijmegen", en: "Nijmegen" }, aliases: ["nijmegen"], lat: 51.8425, lng: 5.8528, isAirport: false },
  { id: "arnhem", label: { nl: "Arnhem", en: "Arnhem" }, aliases: ["arnhem"], lat: 51.9851, lng: 5.8987, isAirport: false },
  { id: "apeldoorn", label: { nl: "Apeldoorn", en: "Apeldoorn" }, aliases: ["apeldoorn"], lat: 52.2112, lng: 5.9699, isAirport: false },
  { id: "zwolle", label: { nl: "Zwolle", en: "Zwolle" }, aliases: ["zwolle"], lat: 52.5168, lng: 6.0830, isAirport: false },
  { id: "groningen", label: { nl: "Groningen", en: "Groningen" }, aliases: ["groningen"], lat: 53.2194, lng: 6.5665, isAirport: false },
  { id: "leeuwarden", label: { nl: "Leeuwarden", en: "Leeuwarden" }, aliases: ["leeuwarden"], lat: 53.2012, lng: 5.7999, isAirport: false },
  { id: "maastricht", label: { nl: "Maastricht", en: "Maastricht" }, aliases: ["maastricht"], lat: 50.8514, lng: 5.6910, isAirport: false },
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** True if `needle` appears in `haystack` as a whole word/phrase, not as
 * part of a longer word — this is what makes matching safe for short
 * aliases like "ams": plain "substring includes" would make "amsterdam"
 * (the city) falsely match an "ams" alias, since "amsterdam" contains
 * "ams" as a substring but not as a separate word. */
function containsWord(haystack: string, needle: string): boolean {
  if (!needle) return false;
  return new RegExp(`(^|\\s)${escapeRegExp(needle)}(\\s|$)`).test(haystack);
}

/**
 * Best-effort match of free-text input against the curated list.
 * Intentionally simple — Phase 2 replaces it with Google Places, at
 * which point this function is the only thing that changes.
 *
 * Two passes: an exact match first (across every location, so a short
 * alias can never shadow a full match elsewhere in the array), then a
 * whole-word/phrase match in either direction (e.g. "Amsterdam Zuid"
 * matches the "amsterdam" alias; "Schiphol" matches the "schiphol
 * airport" alias).
 */
export function matchLocation(input: string): Location | undefined {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return undefined;

  const namesOf = (location: Location) => [
    location.label.nl,
    location.label.en,
    ...location.aliases,
  ];

  const exact = LOCATIONS.find((location) =>
    namesOf(location).some((name) => normalize(name) === normalizedInput)
  );
  if (exact) return exact;

  return LOCATIONS.find((location) =>
    namesOf(location).some((name) => {
      const normalizedName = normalize(name);
      return (
        containsWord(normalizedInput, normalizedName) ||
        containsWord(normalizedName, normalizedInput)
      );
    })
  );
}
