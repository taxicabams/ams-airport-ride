import type { WizardStep } from "./types";

/**
 * The booking wizard's step sequence — split into its own tiny,
 * framework-free file (instead of living inline in BookingWidget.tsx)
 * so the ordering invariant ("price is shown before contact info is
 * asked") can be unit tested without importing the whole React
 * component tree.
 */
export const STEP_ORDER: WizardStep[] = ["route", "details", "quote", "contact"];
