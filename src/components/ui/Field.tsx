import type { ReactNode } from "react";

/**
 * Thin layout wrapper (label + control + optional hint/error) shared by
 * every booking-form input, so spacing/typography stays consistent
 * without a full component-library dependency.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}

export const inputClassName =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-base text-foreground shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";
