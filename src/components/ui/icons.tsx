/**
 * Small shared SVG icons for PickerField (date/time) — kept here so
 * every date/time field in the app (outbound trip, return trip, ...)
 * uses the exact same icon, not a copy that could drift.
 */
export const CalendarIcon = ({ className = "shrink-0 text-muted" }: { className?: string } = {}) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const ClockIcon = ({ className = "shrink-0 text-muted" }: { className?: string } = {}) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
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

/**
 * Shield + checkmark — replaces the old "★" text glyph for the
 * "experienced drivers" trust point. Same hand-drawn-SVG approach as
 * every other icon here.
 */
export const ShieldCheckIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M12 2 20 5.5V11c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5.5Z" strokeLinejoin="round" />
    <path d="m8.5 12 2.5 2.5 4.5-4.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LuggageIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="4" y="7" width="16" height="14" rx="2" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M9 11v6M15 11v6" />
  </svg>
);

/** Mobile nav toggle icons — Header.tsx swaps between the two. */
export const MenuIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);

/** Simple paper-plane silhouette — used for the "24/7 available"-style
 * accent where a dedicated flight glyph reads better than the clock. */
export const WhatsAppIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.82L2 22l5.42-1.35a9.87 9.87 0 0 0 4.62 1.15h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.77.83-3.02-.2-.31a8.13 8.13 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.22-8.2a8.16 8.16 0 0 1 8.19 8.2c0 4.52-3.68 8.24-8.19 8.24Zm4.5-6.16c-.25-.12-1.45-.72-1.67-.8-.22-.08-.39-.12-.55.12-.16.25-.63.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.45-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.24-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.86.84-.86 2.04 0 1.2.88 2.36 1 2.52.12.16 1.73 2.64 4.2 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.55.1.47-.07 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

/**
 * A larger, more detailed sedan silhouette — used for the vehicle
 * visual placeholder (see VehicleShowcase.tsx), not the small inline
 * trust icons above. Same hand-drawn-SVG approach, no icon library.
 */
export const CarIcon = ({ className = "shrink-0" }: { className?: string }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <path d="M8 38 12 26a4 4 0 0 1 3.8-2.7h32.4A4 4 0 0 1 52 26l4 12" strokeLinejoin="round" />
    <rect x="6" y="38" width="52" height="12" rx="3" />
    <path d="M18 23.3 21 15h22l3 8.3" strokeLinejoin="round" />
    <circle cx="18" cy="50" r="5" />
    <circle cx="46" cy="50" r="5" />
    <path d="M6 44h6M52 44h6" />
  </svg>
);
