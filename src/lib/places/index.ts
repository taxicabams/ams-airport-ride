import { googlePlacesProvider } from "./googleProvider";
import type { PlacesProvider } from "./types";

/**
 * The one line that decides which provider is active. Everything else
 * (API routes, AddressField) imports from this file, never from
 * ./googleProvider directly — swapping providers later is a one-line
 * change here plus a new file implementing PlacesProvider.
 */
export const placesProvider: PlacesProvider = googlePlacesProvider;

export type { PlaceSuggestion, ResolvedPlace, PlacesProvider } from "./types";
export { PlacesNotConfiguredError } from "./types";
