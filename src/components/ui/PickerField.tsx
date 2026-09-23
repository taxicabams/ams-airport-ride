"use client";

import type { ReactNode } from "react";

/**
 * A native <input type="date"|"time"> that LOOKS like a friendly
 * "Kies datum" / "Kies tijd" button instead of the browser's raw empty
 * placeholder ("dd-mm-jjjj" / "--:--"). The real input stays fully
 * present and interactive (just visually transparent) so mobile still
 * gets the native OS date/time picker on tap — no calendar library, no
 * new dependency.
 */
export function PickerField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  displayValue,
  min,
  step,
  icon,
}: {
  id: string;
  label: string;
  type: "date" | "time";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  /** Formatted text to show once a value is picked, e.g. "wo 23 sep". */
  displayValue?: string;
  min?: string;
  step?: number;
  icon: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        {/* The real input stays interactive but invisible — it's what
            actually opens the native picker and receives keyboard
            focus. `peer` lets the visible div below react to that
            focus, since the div itself is pointer-events-none. */}
        <input
          id={id}
          type={type}
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          aria-hidden
          className="pointer-events-none flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3.5 py-2.5 text-base shadow-sm transition peer-focus:border-brand peer-focus:ring-2 peer-focus:ring-brand/20"
        >
          <span className={value ? "text-foreground" : "text-muted"}>
            {value ? displayValue : placeholder}
          </span>
          {icon}
        </div>
      </div>
    </div>
  );
}
