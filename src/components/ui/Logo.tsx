/**
 * Original hand-drawn SVG mark — same convention as icons.tsx (no icon
 * library, no stock/AI imagery). The mark itself is a small navy badge
 * containing a route line from a location pin (Amsterdam) sweeping up to
 * a minimal paper-plane silhouette (Schiphol/departure) — a subtle
 * plane/route/pin motif per the brand brief, deliberately not a literal
 * airplane clip-art icon. The badge carries its own background/foreground
 * colors (not currentColor) so it reads correctly regardless of what's
 * behind it — the header, the dark footer, or a browser tab (see the
 * matching static markup in src/app/icon.svg used for the favicon).
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="10" className="fill-brand" />
      <path
        d="M9 30 Q16 13, 30 9"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="9" cy="30" r="2.6" fill="#ffffff" />
      <path d="M30 9 36.5 4.5 32 13.5 28.5 12Z" fill="#ffffff" />
    </svg>
  );
}

/**
 * Full lockup — mark + a two-line wordmark ("AMS" bold, "Airport Ride"
 * small caps beneath, per the brief's own suggested structure). Used in
 * the header and footer; both already theme-aware via the brand/muted
 * CSS custom properties, so no separate dark-mode variant is needed.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-9 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-bold tracking-tight text-brand">AMS</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          Airport Ride
        </span>
      </span>
    </span>
  );
}
