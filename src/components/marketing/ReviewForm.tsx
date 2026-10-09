"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Field, inputClassName } from "@/components/ui/Field";
import { StarIcon } from "@/components/ui/icons";

/**
 * The customer-facing half of the review system — linked from
 * sendReviewRequestEmail (lib/email.ts). Posts straight to the existing
 * /api/reviews endpoint (already rate-limited/validated there), which
 * always stores the submission as unpublished — nothing typed here
 * becomes publicly visible until the owner approves it, so there's
 * deliberately no "your review is now live" claim on this page, only an
 * honest "we'll review it and publish it" message.
 *
 * Real UX gap found: only the rating itself is required to submit —
 * name and comment are both optional (see the API route's own note on
 * the "Anoniem"/"Anonymous" default). A reviewer who already decided
 * "it was great" and tapped a star link straight from the request email
 * (?rating=N, read below) can submit in one more tap, with zero typing.
 */
export function ReviewForm() {
  const t = useTranslations("ReviewForm");
  const locale = useLocale() as "nl" | "en";
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fromEmail = Number(searchParams.get("rating"));
    if (Number.isInteger(fromEmail) && fromEmail >= 1 && fromEmail <= 5) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRating(fromEmail);
    }
    // Only ever read once, on the link that brought the visitor here —
    // never re-run on an unrelated re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName: name, rating, comment, locale }),
      });
      if (!response.ok) throw new Error("failed");
      setDone(true);
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <h1 className="font-heading text-2xl font-extrabold text-foreground">{t("thanksTitle")}</h1>
        <p className="mt-2 text-muted">{t("thanksBody")}</p>
        <Link href="/" className="mt-6 inline-block text-sm font-semibold text-brand-text underline underline-offset-2">
          {t("backHome")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-foreground">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted">{t("subtitle")}</p>
      </div>

      <Field label={t("ratingLabel")} htmlFor="rating">
        <div className="flex gap-1" role="radiogroup" aria-label={t("ratingLabel")}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={String(value)}
              onClick={() => setRating(value)}
              onMouseEnter={() => setHoverRating(value)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1"
            >
              <StarIcon
                className={`h-8 w-8 ${value <= (hoverRating || rating) ? "text-brand" : "text-border"}`}
              />
            </button>
          ))}
        </div>
      </Field>

      <Field label={t("nameLabel")} htmlFor="review-name">
        <input
          id="review-name"
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("namePlaceholder")}
          className={inputClassName}
        />
      </Field>

      <Field label={t("commentLabel")} htmlFor="review-comment">
        <textarea
          id="review-comment"
          rows={4}
          maxLength={1000}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("commentPlaceholder")}
          className={`${inputClassName} resize-none`}
        />
      </Field>

      {error && <p className="text-sm font-medium text-danger">{t("submitError")}</p>}

      <button
        type="submit"
        disabled={submitting || rating === 0}
        className="mt-1 flex w-full items-center justify-center rounded-xl bg-brand px-5 py-3.5 text-base font-semibold text-brand-foreground shadow-sm transition enabled:hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-40"
      >
        {submitting ? t("submitting") : t("submitButton")}
      </button>
    </form>
  );
}
