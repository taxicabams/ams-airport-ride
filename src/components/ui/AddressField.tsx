"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { PlaceSuggestion, ResolvedPlace } from "@/lib/places";
import { inputClassName } from "./Field";

const DEBOUNCE_MS = 300;
const MIN_INPUT_LENGTH = 3;

type FetchState = "idle" | "loading" | "results" | "empty" | "not_configured" | "unavailable";

/**
 * A real Google Places Autocomplete field, styled to match the rest of
 * the design system instead of Google's unthemeable widget — see the
 * plan's reasoning for why this calls our own /api/places/* routes
 * (server-side, key never reaches the browser) rather than loading
 * Google's client-side Maps JS SDK.
 *
 * Critically: typing alone is never "a valid address." `onResolve`
 * only fires when the customer picks a suggestion, and the parent
 * (RouteStep) uses that — not just non-empty text — to decide whether
 * the field is actually usable. Editing the text after a resolution
 * immediately un-resolves it again.
 */
export function AddressField({
  id,
  label,
  placeholder,
  value,
  onChange,
  onResolve,
  locale,
  error,
  loadingLabel,
  noResultsLabel,
  notConfiguredLabel,
  unavailableLabel,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onResolve: (place: ResolvedPlace | null) => void;
  locale: "nl" | "en";
  error?: string;
  loadingLabel: string;
  noResultsLabel: string;
  notConfiguredLabel: string;
  unavailableLabel: string;
}) {
  const listboxId = useId();
  const errorId = useId();
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [state, setState] = useState<FetchState>("idle");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const sessionTokenRef = useRef(crypto.randomUUID());
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the dropdown on outside click.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function fetchSuggestions(input: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (input.trim().length < MIN_INPUT_LENGTH) {
      setSuggestions([]);
      setState("idle");
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setState("loading");
      try {
        const res = await fetch("/api/places/autocomplete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, sessionToken: sessionTokenRef.current, locale }),
        });
        const data = await res.json();
        if (!res.ok) {
          setState(data.error === "places_not_configured" ? "not_configured" : "unavailable");
          setSuggestions([]);
          return;
        }
        const results = (data.suggestions ?? []) as PlaceSuggestion[];
        setSuggestions(results);
        setState(results.length > 0 ? "results" : "empty");
      } catch {
        setState("unavailable");
        setSuggestions([]);
      }
    }, DEBOUNCE_MS);
  }

  function handleInputChange(text: string) {
    onChange(text);
    onResolve(null); // any edit un-resolves a previously picked address
    setActiveIndex(-1);
    setOpen(true);
    fetchSuggestions(text);
  }

  async function handleSelect(suggestion: PlaceSuggestion) {
    setOpen(false);
    onChange(`${suggestion.primaryText}, ${suggestion.secondaryText}`.replace(/,\s*$/, ""));

    try {
      const res = await fetch("/api/places/details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ placeId: suggestion.id, sessionToken: sessionTokenRef.current }),
      });
      const data = await res.json();
      if (!res.ok) {
        onResolve(null);
        setState(data.error === "places_not_configured" ? "not_configured" : "unavailable");
        return;
      }
      const place = data.place as ResolvedPlace;
      onChange(place.formattedAddress);
      onResolve(place);
      // This search is done — start a fresh session for the next one,
      // per Google's session-token billing model.
      sessionTokenRef.current = crypto.randomUUID();
    } catch {
      onResolve(null);
      setState("unavailable");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showDropdown = open && state !== "idle";

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={inputClassName}
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => value.trim().length >= MIN_INPUT_LENGTH && setOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {showDropdown && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
          >
            {state === "loading" && (
              <li className="px-3.5 py-2.5 text-sm text-muted">{loadingLabel}</li>
            )}
            {state === "empty" && (
              <li className="px-3.5 py-2.5 text-sm text-muted">{noResultsLabel}</li>
            )}
            {state === "not_configured" && (
              <li className="px-3.5 py-2.5 text-sm text-muted">{notConfiguredLabel}</li>
            )}
            {state === "unavailable" && (
              <li className="px-3.5 py-2.5 text-sm text-muted">{unavailableLabel}</li>
            )}
            {state === "results" &&
              suggestions.map((s, i) => (
                <li
                  key={s.id}
                  id={`${listboxId}-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep focus in the input, avoid a blur-before-click race
                    handleSelect(s);
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`cursor-pointer px-3.5 py-2.5 text-sm ${
                    i === activeIndex ? "bg-brand/10" : ""
                  }`}
                >
                  <span className="font-medium text-foreground">{s.primaryText}</span>
                  {s.secondaryText && <span className="text-muted"> — {s.secondaryText}</span>}
                </li>
              ))}
          </ul>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
