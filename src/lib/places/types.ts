/**
 * Provider-agnostic address-lookup types. Every consumer (the API
 * routes, AddressField) only ever imports from here and from
 * ./index — never directly from ./googleProvider. Swapping Google for
 * another provider later means writing one new file that implements
 * `PlacesProvider` and changing one line in ./index.ts.
 */

export type PlaceSuggestion = {
  /** Provider-specific place id — opaque to callers, passed back into getDetails(). */
  id: string;
  /** e.g. "Dam" */
  primaryText: string;
  /** e.g. "Amsterdam, Nederland" */
  secondaryText: string;
};

export type ResolvedPlace = {
  placeId: string;
  formattedAddress: string;
  lat: number;
  lng: number;
};

export interface PlacesProvider {
  autocomplete(input: string, sessionToken: string, languageCode: string): Promise<PlaceSuggestion[]>;
  getDetails(placeId: string, sessionToken: string): Promise<ResolvedPlace>;
}

/**
 * Thrown when the provider can't run at all (e.g. no API key
 * configured) — distinct from "zero suggestions found," which is a
 * normal, valid result, not an error.
 */
export class PlacesNotConfiguredError extends Error {
  constructor(message = "Places provider is not configured") {
    super(message);
    this.name = "PlacesNotConfiguredError";
  }
}
