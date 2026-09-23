import { googleRoutesProvider } from "./googleRoutesProvider";
import type { RoutesProvider } from "./types";

/** The one line that decides which routing provider is active. */
export const routesProvider: RoutesProvider = googleRoutesProvider;

export type { RouteResult, RoutesProvider, LatLng } from "./types";
export { RoutesNotConfiguredError } from "./types";
