import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ClockIcon } from "@/components/ui/icons";

/**
 * Expands last pass's small inline card into the brief's full dark
 * (--ink) section. Copy is the already-corrected, honest version — "we
 * take it into account," never "we monitor your flight automatically,"
 * since no such automated tracking exists (see the earlier fix this
 * session). A subtle route-line accent, not a literal airplane icon
 * plastered across the section.
 */
export async function FlightDelay() {
  const t = await getTranslations("FlightDelay");

  return (
    <section className="bg-ink py-14 text-ink-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:px-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
          <ClockIcon className="h-6 w-6 text-white" />
        </span>
        <h2 className="text-2xl font-bold sm:text-3xl">
          {t("title")} <span className="text-brand-light">{t("highlight")}</span>
        </h2>
        <p className="max-w-xl text-white/70">{t("note")}</p>
        <Link
          href="/#boeken"
          className="mt-2 inline-block rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:brightness-110"
        >
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
