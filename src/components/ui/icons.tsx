/**
 * Small shared SVG icons for PickerField (date/time) — kept here so
 * every date/time field in the app (outbound trip, return trip, ...)
 * uses the exact same icon, not a copy that could drift.
 */
export const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-muted">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

/**
 * Small trust/feature icons for the homepage (price, payment, receipt,
 * door-to-door, luggage) — same hand-drawn-SVG approach as
 * CalendarIcon/ClockIcon above, so no icon-library dependency is added
 * just for these five glyphs. `className` is left to the caller (unlike
 * the two above, which are always the same muted size) since these are
 * reused at a couple of different sizes/colors across the homepage.
 */
export const PriceTagIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l9 9a1 1 0 0 1 0 1.41Z" />
    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

export const PaymentIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

export const ReceiptIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 2h12v19l-3-2-3 2-3-2-3 2Z" />
    <path d="M9 8h6M9 12h6" />
  </svg>
);

export const DoorIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="1" />
    <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const LuggageIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="4" y="7" width="16" height="14" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 11v6M15 11v6" />
  </svg>
);
