"use client";

import type { AnchorHTMLAttributes } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

/**
 * A plain <a> that also fires a track() call on click — used for the
 * phone/WhatsApp links that live in server components (Header, FinalCta,
 * StickyMobileCta, the Ads landing page, ...) which can't attach an
 * onClick handler themselves. Every real phone/WhatsApp touchpoint on
 * the site should use this, not a bare <a>, so Ads conversion tracking
 * ("bel-klik"/"WhatsApp-klik") actually covers all of them, not just the
 * one inside the booking flow's contact step.
 */
export function TrackedLink({
  event,
  ...props
}: { event: AnalyticsEvent } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} onClick={() => track(event)} />;
}
