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

  // --- Amsterdam neighborhoods/areas — Schiphol pricing now varies by
  // area (see lib/pricing/staticRoutes.ts) instead of one flat
  // Amsterdam price. The plain "amsterdam" entry above stays as the
  // generic fallback for the SEO route page and for input that doesn't
  // name a specific area.
  { id: "sloten", label: { nl: "Sloten", en: "Sloten" }, aliases: ["sloten"], lat: 52.3630, lng: 4.8080, isAirport: false },
  { id: "nieuw-west-osdorp", label: { nl: "Nieuw-West / Osdorp", en: "Nieuw-West / Osdorp" }, aliases: ["nieuw west", "osdorp"], lat: 52.3600, lng: 4.8000, isAirport: false },
  { id: "de-aker-badhoevedorp", label: { nl: "De Aker / Badhoevedorp", en: "De Aker / Badhoevedorp" }, aliases: ["de aker", "badhoevedorp"], lat: 52.3540, lng: 4.7780, isAirport: false },
  { id: "west", label: { nl: "West", en: "West (Amsterdam)" }, aliases: ["west", "amsterdam west"], lat: 52.3770, lng: 4.8600, isAirport: false },
  { id: "westerpark", label: { nl: "Westerpark", en: "Westerpark" }, aliases: ["westerpark"], lat: 52.3860, lng: 4.8690, isAirport: false },
  { id: "bos-en-lommer", label: { nl: "Bos en Lommer", en: "Bos en Lommer" }, aliases: ["bos en lommer"], lat: 52.3800, lng: 4.8500, isAirport: false },
  { id: "de-baarsjes", label: { nl: "De Baarsjes", en: "De Baarsjes" }, aliases: ["de baarsjes", "baarsjes"], lat: 52.3660, lng: 4.8570, isAirport: false },
  { id: "oud-west", label: { nl: "Oud-West", en: "Oud-West" }, aliases: ["oud west"], lat: 52.3660, lng: 4.8690, isAirport: false },
  { id: "zuid", label: { nl: "Zuid", en: "Zuid (Amsterdam)" }, aliases: ["zuid", "amsterdam zuid"], lat: 52.3400, lng: 4.8730, isAirport: false },
  { id: "de-pijp", label: { nl: "De Pijp", en: "De Pijp" }, aliases: ["de pijp", "pijp"], lat: 52.3560, lng: 4.8930, isAirport: false },
  { id: "rivierenbuurt", label: { nl: "Rivierenbuurt", en: "Rivierenbuurt" }, aliases: ["rivierenbuurt"], lat: 52.3480, lng: 4.8960, isAirport: false },
  { id: "oud-zuid", label: { nl: "Oud-Zuid", en: "Oud-Zuid" }, aliases: ["oud zuid"], lat: 52.3520, lng: 4.8760, isAirport: false },
  { id: "buitenveldert", label: { nl: "Buitenveldert", en: "Buitenveldert" }, aliases: ["buitenveldert"], lat: 52.3320, lng: 4.8720, isAirport: false },
  { id: "zuidas", label: { nl: "Zuidas", en: "Zuidas" }, aliases: ["zuidas"], lat: 52.3390, lng: 4.8730, isAirport: false },
  { id: "centrum", label: { nl: "Centrum", en: "Centrum (Amsterdam)" }, aliases: ["centrum", "amsterdam centrum", "city centre"], lat: 52.3702, lng: 4.8952, isAirport: false },
  { id: "jordaan", label: { nl: "Jordaan", en: "Jordaan" }, aliases: ["jordaan"], lat: 52.3745, lng: 4.8815, isAirport: false },
  { id: "grachtengordel", label: { nl: "Grachtengordel", en: "Grachtengordel (Canal Ring)" }, aliases: ["grachtengordel", "canal ring"], lat: 52.3680, lng: 4.8890, isAirport: false },
  { id: "oost", label: { nl: "Oost", en: "Oost (Amsterdam)" }, aliases: ["oost", "amsterdam oost"], lat: 52.3610, lng: 4.9280, isAirport: false },
  { id: "watergraafsmeer", label: { nl: "Watergraafsmeer", en: "Watergraafsmeer" }, aliases: ["watergraafsmeer"], lat: 52.3480, lng: 4.9370, isAirport: false },
  { id: "indische-buurt", label: { nl: "Indische Buurt", en: "Indische Buurt" }, aliases: ["indische buurt"], lat: 52.3630, lng: 4.9400, isAirport: false },
  { id: "dapperbuurt", label: { nl: "Dapperbuurt", en: "Dapperbuurt" }, aliases: ["dapperbuurt"], lat: 52.3620, lng: 4.9280, isAirport: false },
  { id: "noord", label: { nl: "Noord", en: "Noord (Amsterdam)" }, aliases: ["noord", "amsterdam noord"], lat: 52.3980, lng: 4.9070, isAirport: false },
  { id: "ijburg", label: { nl: "IJburg", en: "IJburg" }, aliases: ["ijburg"], lat: 52.3540, lng: 5.0140, isAirport: false },
  { id: "zeeburgereiland", label: { nl: "Zeeburgereiland", en: "Zeeburgereiland" }, aliases: ["zeeburgereiland"], lat: 52.3690, lng: 4.9640, isAirport: false },
  { id: "zuidoost", label: { nl: "Zuidoost", en: "Zuidoost (Amsterdam)" }, aliases: ["zuidoost", "amsterdam zuidoost"], lat: 52.3120, lng: 4.9560, isAirport: false },
  { id: "bijlmer", label: { nl: "Bijlmer", en: "Bijlmer" }, aliases: ["bijlmer", "bijlmermeer"], lat: 52.3130, lng: 4.9490, isAirport: false },
  { id: "arena-amstel-iii", label: { nl: "ArenA / Amstel III", en: "ArenA / Amstel III" }, aliases: ["arena", "amstel iii", "amstel 3"], lat: 52.3110, lng: 4.9420, isAirport: false },
  { id: "gaasperdam", label: { nl: "Gaasperdam", en: "Gaasperdam" }, aliases: ["gaasperdam"], lat: 52.2990, lng: 4.9840, isAirport: false },

  // --- Surrounding cities/towns
  { id: "amstelveen", label: { nl: "Amstelveen", en: "Amstelveen" }, aliases: ["amstelveen"], lat: 52.3114, lng: 4.8646, isAirport: false },
  { id: "zwanenburg", label: { nl: "Zwanenburg", en: "Zwanenburg" }, aliases: ["zwanenburg"], lat: 52.3706, lng: 4.7439, isAirport: false },
  { id: "halfweg", label: { nl: "Halfweg", en: "Halfweg" }, aliases: ["halfweg"], lat: 52.3810, lng: 4.7580, isAirport: false },
  { id: "diemen", label: { nl: "Diemen", en: "Diemen" }, aliases: ["diemen"], lat: 52.3400, lng: 4.9600, isAirport: false },
  { id: "ouderkerk-aan-de-amstel", label: { nl: "Ouderkerk aan de Amstel", en: "Ouderkerk aan de Amstel" }, aliases: ["ouderkerk aan de amstel", "ouderkerk"], lat: 52.2930, lng: 4.9080, isAirport: false },
  { id: "abcoude", label: { nl: "Abcoude", en: "Abcoude" }, aliases: ["abcoude"], lat: 52.2740, lng: 4.9720, isAirport: false },
  { id: "weesp", label: { nl: "Weesp", en: "Weesp" }, aliases: ["weesp"], lat: 52.3070, lng: 5.0430, isAirport: false },
  { id: "uithoorn", label: { nl: "Uithoorn", en: "Uithoorn" }, aliases: ["uithoorn"], lat: 52.2380, lng: 4.8280, isAirport: false },
  { id: "haarlem", label: { nl: "Haarlem", en: "Haarlem" }, aliases: ["haarlem"], lat: 52.3874, lng: 4.6462, isAirport: false },
  { id: "heemstede", label: { nl: "Heemstede", en: "Heemstede" }, aliases: ["heemstede"], lat: 52.3480, lng: 4.6280, isAirport: false },
  { id: "bloemendaal", label: { nl: "Bloemendaal", en: "Bloemendaal" }, aliases: ["bloemendaal"], lat: 52.3980, lng: 4.6260, isAirport: false },
  { id: "aerdenhout", label: { nl: "Aerdenhout", en: "Aerdenhout" }, aliases: ["aerdenhout"], lat: 52.3660, lng: 4.6030, isAirport: false },
  { id: "velsen", label: { nl: "Velsen", en: "Velsen" }, aliases: ["velsen"], lat: 52.4600, lng: 4.6570, isAirport: false },
  { id: "ijmuiden", label: { nl: "IJmuiden", en: "IJmuiden" }, aliases: ["ijmuiden"], lat: 52.4600, lng: 4.6110, isAirport: false },
  { id: "wormerveer", label: { nl: "Wormerveer", en: "Wormerveer" }, aliases: ["wormerveer"], lat: 52.4990, lng: 4.7730, isAirport: false },
  { id: "purmerend", label: { nl: "Purmerend", en: "Purmerend" }, aliases: ["purmerend"], lat: 52.5050, lng: 4.9590, isAirport: false },
  { id: "alkmaar", label: { nl: "Alkmaar", en: "Alkmaar" }, aliases: ["alkmaar"], lat: 52.6324, lng: 4.7534, isAirport: false },
  { id: "beverwijk", label: { nl: "Beverwijk", en: "Beverwijk" }, aliases: ["beverwijk"], lat: 52.4840, lng: 4.6570, isAirport: false },
  { id: "hoorn", label: { nl: "Hoorn", en: "Hoorn" }, aliases: ["hoorn"], lat: 52.6425, lng: 5.0597, isAirport: false },
  { id: "almere-stad", label: { nl: "Almere Stad", en: "Almere Stad" }, aliases: ["almere stad", "almere"], lat: 52.3508, lng: 5.2647, isAirport: false },
  { id: "almere-buiten", label: { nl: "Almere Buiten", en: "Almere Buiten" }, aliases: ["almere buiten"], lat: 52.3960, lng: 5.2360, isAirport: false },
  { id: "almere-haven", label: { nl: "Almere Haven", en: "Almere Haven" }, aliases: ["almere haven"], lat: 52.3460, lng: 5.2270, isAirport: false },
  { id: "lelystad", label: { nl: "Lelystad", en: "Lelystad" }, aliases: ["lelystad"], lat: 52.5185, lng: 5.4714, isAirport: false },
  { id: "utrecht", label: { nl: "Utrecht", en: "Utrecht" }, aliases: ["utrecht"], lat: 52.0907, lng: 5.1214, isAirport: false },
  { id: "maarssen", label: { nl: "Maarssen", en: "Maarssen" }, aliases: ["maarssen"], lat: 52.1330, lng: 5.0450, isAirport: false },
  { id: "breukelen", label: { nl: "Breukelen", en: "Breukelen" }, aliases: ["breukelen"], lat: 52.1730, lng: 5.0000, isAirport: false },
  { id: "nieuwegein", label: { nl: "Nieuwegein", en: "Nieuwegein" }, aliases: ["nieuwegein"], lat: 52.0290, lng: 5.0830, isAirport: false },
  { id: "zeist", label: { nl: "Zeist", en: "Zeist" }, aliases: ["zeist"], lat: 52.0875, lng: 5.2325, isAirport: false },
  { id: "hilversum", label: { nl: "Hilversum", en: "Hilversum" }, aliases: ["hilversum"], lat: 52.2292, lng: 5.1669, isAirport: false },
  { id: "amersfoort", label: { nl: "Amersfoort", en: "Amersfoort" }, aliases: ["amersfoort"], lat: 52.1561, lng: 5.3878, isAirport: false },
  { id: "leiden", label: { nl: "Leiden", en: "Leiden" }, aliases: ["leiden"], lat: 52.1601, lng: 4.4970, isAirport: false },
  { id: "alphen-aan-den-rijn", label: { nl: "Alphen aan den Rijn", en: "Alphen aan den Rijn" }, aliases: ["alphen aan den rijn", "alphen"], lat: 52.1290, lng: 4.6576, isAirport: false },
  { id: "den-haag", label: { nl: "Den Haag", en: "The Hague" }, aliases: ["den haag", "'s-gravenhage", "the hague", "s gravenhage"], lat: 52.0705, lng: 4.3007, isAirport: false },
  { id: "delft", label: { nl: "Delft", en: "Delft" }, aliases: ["delft"], lat: 52.0116, lng: 4.3571, isAirport: false },
  { id: "zoetermeer", label: { nl: "Zoetermeer", en: "Zoetermeer" }, aliases: ["zoetermeer"], lat: 52.0575, lng: 4.4933, isAirport: false },
  { id: "gouda", label: { nl: "Gouda", en: "Gouda" }, aliases: ["gouda"], lat: 52.0115, lng: 4.7104, isAirport: false },
  { id: "rotterdam", label: { nl: "Rotterdam", en: "Rotterdam" }, aliases: ["rotterdam"], lat: 51.9244, lng: 4.4777, isAirport: false },
  { id: "dordrecht", label: { nl: "Dordrecht", en: "Dordrecht" }, aliases: ["dordrecht"], lat: 51.8133, lng: 4.6901, isAirport: false },
  { id: "hoofddorp", label: { nl: "Hoofddorp", en: "Hoofddorp" }, aliases: ["hoofddorp"], lat: 52.3025, lng: 4.6889, isAirport: false },
  { id: "aalsmeer", label: { nl: "Aalsmeer", en: "Aalsmeer" }, aliases: ["aalsmeer"], lat: 52.2644, lng: 4.7554, isAirport: false },
  { id: "zaandam", label: { nl: "Zaandam", en: "Zaandam" }, aliases: ["zaandam", "zaanstad"], lat: 52.4389, lng: 4.8262, isAirport: false },

  // --- Other NL cities (no curated Schiphol price yet — priced via the
  // fallback formula until added to staticRoutes.ts)
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
