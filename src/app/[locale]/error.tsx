"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { companyInfo } from "@/lib/companyInfo";

/**
 * No error boundary existed anywhere in the app before this — a real
 * gap found during a full audit pass (client's own request: "nooit
 * technische foutmeldingen zoals '500 Internal Server Error' aan de
 * klant tonen"). Without this file, an unhandled exception in any
 * Server Component under the [locale] segment (a page, a layout, a
 * data fetch) fell through to Next's bare default error screen —
 * exactly the kind of raw, unbranded failure state the brief forbids.
 *
 * This is a Client Component by Next's own contract for error.tsx —
 * it receives the thrown error and a `reset()` that re-renders the
 * segment tree without a full page reload (worth trying first, since
 * many real failures here are transient: a slow/unreachable Postgres
 * connection, a flaky upstream Google Places/Routes call). The actual
 * error is logged to the console for debugging but never shown to the
 * customer — same "generic safe message, real cause server/console-side
 * only" pattern already used in /api/bookings' catch block.
 *
 * A WhatsApp link is included as a real fallback: if someone hits this
 * screen while trying to book a ride to/from the airport, "try again"
 * might not be reassuring enough on its own.
 */
export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");
  const tb = useTranslations("Booking");

  useEffect(() => {
    console.error("[LocaleError]", error);
  }, [error]);

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-3 text-muted">{t("body")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
        >
          {t("retryButton")}
        </button>
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted-background"
        >
          {t("homeLink")}
        </Link>
        {companyInfo.whatsapp && (
          <a
            href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(tb("whatsappPrefill"))}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted-background"
          >
            {t("whatsappLink")}
          </a>
        )}
      </div>
    </section>
  );
}
