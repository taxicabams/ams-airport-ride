import { PlaneIcon } from "@/components/ui/icons";

/**
 * The brief's literal "AMS ● ───── ✈ ───── ● SCHIPHOL" flight-path
 * motif, as a small reusable component — used sparingly (Hero, route
 * cards) so it becomes a recognizable piece of the brand rather than
 * decoration repeated everywhere. Text + a dashed line + the existing
 * hand-drawn plane icon, not a new illustration.
 */
export function FlightPathDivider({
  from,
  to,
  className = "",
}: {
  from: string;
  to: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted ${className}`}>
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
        {from}
      </span>
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-[repeating-linear-gradient(to_right,currentColor_0,currentColor_3px,transparent_3px,transparent_7px)] text-border"
      />
      <PlaneIcon className="h-3.5 w-3.5 shrink-0 text-brand" />
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-[repeating-linear-gradient(to_right,currentColor_0,currentColor_3px,transparent_3px,transparent_7px)] text-border"
      />
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
        {to}
      </span>
    </div>
  );
}
