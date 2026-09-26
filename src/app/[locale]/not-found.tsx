import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * No custom 404 existed before this — a missing/removed URL (a typo, an
 * old bookmark, a since-removed [slug] route page) fell through to
 * Next's bare default page. This one at least gets the visitor back to
 * the booking calculator instead of a dead end. Covers every notFound()
 * call within the [locale] segment tree, including the [slug] route
 * pages' own notFound() for an unknown city slug.
 */
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-text">404</p>
      <h1 className="mt-2 text-2xl font-bold text-foreground">{t("title")}</h1>
      <p className="mt-3 text-muted">{t("body")}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted-background"
        >
          {t("homeLink")}
        </Link>
        <Link
          href="/#boeken"
          className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
        >
          {t("bookLink")}
        </Link>
      </div>
    </section>
  );
}
