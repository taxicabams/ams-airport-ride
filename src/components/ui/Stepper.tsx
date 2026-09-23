"use client";

/**
 * A −/+ quantity selector (passengers, luggage) — friendlier and more
 * mobile-thumb-friendly than a raw <input type="number">, and it's what
 * every competitor researched for the plan uses for this exact field.
 */
export function Stepper({
  id,
  label,
  value,
  min,
  max,
  onChange,
  decreaseLabel,
  increaseLabel,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  decreaseLabel: string;
  increaseLabel: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground" id={`${id}-label`}>
        {label}
      </span>
      <div className="flex items-center justify-between rounded-lg border border-border bg-background px-2 py-1.5">
        <button
          type="button"
          aria-label={decreaseLabel}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-brand transition hover:bg-muted-background disabled:cursor-not-allowed disabled:opacity-30"
        >
          −
        </button>
        <span
          role="status"
          aria-labelledby={`${id}-label`}
          aria-live="polite"
          className="text-base font-semibold text-foreground"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label={increaseLabel}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-semibold text-brand transition hover:bg-muted-background disabled:cursor-not-allowed disabled:opacity-30"
        >
          +
        </button>
      </div>
    </div>
  );
}
