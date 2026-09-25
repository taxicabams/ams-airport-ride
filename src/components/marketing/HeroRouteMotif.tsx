/**
 * The hero's visual slot per the redesign brief: "a professional
 * airport-transfer visual" next to the copy. No real photo exists yet
 * (see lib/heroVisual.ts for why one isn't faked), so this is an
 * original illustration instead — a dashed route line arcing from a
 * location point toward a small plane silhouette, echoing "your ride
 * from home to Schiphol" without literally drawing a car (avoids the
 * brief's own "no taxi cartoon" rule). Purely decorative (aria-hidden),
 * very low opacity, and positioned behind the text/calculator so it adds
 * atmosphere without competing with either for attention — the booking
 * calculator stays the dominant element, per the brief's own priority.
 */
export function HeroRouteMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={className}
    >
      <path
        d="M40 340 C 220 300, 340 200, 460 130 S 680 60, 760 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeDasharray="2 14"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="40" cy="340" r="5" fill="currentColor" />
      <path d="M760 40 776 24 764 56 750 50Z" fill="currentColor" />
    </svg>
  );
}
