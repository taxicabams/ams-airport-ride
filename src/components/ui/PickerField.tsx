"use client";

import { useState, type ReactNode } from "react";

/**
 * A native <input type="date"|"time"> styled as a friendly "Kies
 * datum" / "Kies tijd" button instead of the browser's raw empty
 * placeholder ("dd-mm-jjjj" / "--:--") — no calendar library, no new
 * dependency.
 *
 * Two earlier attempts, both fixed after finding real problems:
 * 1. An invisible (opacity-0) real input *behind* a fake visible div.
 *    Known-unreliable on iOS Safari: a zero-opacity control sometimes
 *    only registers the first tap as a generic focus event and needs a
 *    second tap before the native picker actually opens.
 * 2. Making the real (now visible/opaque) input's own text permanently
 *    transparent, with our formatted label painted on top. Tap
 *    reliability was fixed, but this broke desktop keyboard editing:
 *    with the native day/month/year segments invisible, a sighted
 *    keyboard user typing a date couldn't see which segment was
 *    selected or what they'd typed.
 *
 * This version: the real, fully-opaque input is always the one thing
 * the user taps/clicks (fixing #1) — but its own text is only made
 * transparent (in favor of our overlay) while it's NOT focused. The
 * moment it gains focus (click, tap, or Tab), the native text becomes
 * visible again so typing/picking has normal visual feedback, and our
 * overlay's placeholder/formatted text hides so the two don't overlap.
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
  /** Formatted text to show once a value is picked, e.g. "29 september 2026". */
  displayValue?: string;
  min?: string;
  step?: number;
  icon: ReactNode;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          min={min}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={[
            "w-full appearance-none rounded-lg border border-border bg-background px-3.5 py-2.5 text-base shadow-sm outline-none transition",
            "[color-scheme:light] dark:[color-scheme:dark]",
            "[&::-webkit-calendar-picker-indicator]:opacity-0",
            "focus:border-brand focus:ring-2 focus:ring-brand/20",
            focused ? "text-foreground" : "text-transparent caret-transparent",
          ].join(" ")}
        />
        {/* Purely visual — the real input above is the only thing that
            receives taps/clicks/focus. Text hides while focused so it
            never overlaps the now-visible native segments; the icon
            stays put either way. */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between gap-2 px-3.5 py-2.5 text-base">
          <span className={focused ? "invisible" : value ? "text-foreground" : "text-muted"}>
            {value ? displayValue : placeholder}
          </span>
          {icon}
        </div>
      </div>
    </div>
  );
}
