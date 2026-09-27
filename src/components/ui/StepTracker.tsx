/**
 * Numbered step tracker with connecting lines (1 Route — 2 Voertuig —
 * 3 Prijs — 4 Gegevens), replacing the previous thin progress bar — per
 * direct feedback showing a reference layout with exactly this style.
 * Labels describe what each real step actually does (route/vehicle+
 * schedule/price/contact details) rather than forcing the reference
 * image's own wording onto a differently-shaped flow.
 */
export function StepTracker({
  steps,
  currentIndex,
}: {
  steps: string[];
  currentIndex: number;
}) {
  return (
    <ol className="mb-6 flex items-start">
      {steps.map((label, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                  isCurrent
                    ? "bg-brand text-brand-foreground"
                    : isComplete
                      ? "bg-brand-text text-white"
                      : "bg-muted-background text-muted"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`text-[11px] font-medium sm:text-xs ${
                  isCurrent ? "text-foreground" : "text-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`mx-2 h-px flex-1 ${i < currentIndex ? "bg-brand-text" : "bg-border"}`}
                style={{ marginBottom: "1.1rem" }}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
