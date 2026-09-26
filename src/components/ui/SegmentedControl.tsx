"use client";

/** A small pill-style toggle (e.g. "Enkele reis" / "Retour") — plain buttons, no new dependency. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-full border border-border bg-muted-background p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={option.value === value}
          onClick={() => onChange(option.value)}
          className={[
            // min-h-9 matches Stepper's −/+ buttons (the app's existing
            // small-control touch-target convention) so this new pill
            // toggle doesn't introduce a smaller tap target than what's
            // already elsewhere on the same screen.
            "flex min-h-9 items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition",
            option.value === value
              ? "bg-surface text-brand-text shadow-sm"
              : "text-muted hover:text-foreground",
          ].join(" ")}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
