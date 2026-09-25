import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { amsterdamPhoto } from "@/lib/amsterdamPhoto";

/**
 * Makes explicit what the pricing engine and homepage FAQ already know
 * but the hero (Schiphol-first, by design) doesn't say out loud: this
 * isn't an airport-only service. Deliberately kept smaller/more compact
 * than the Schiphol sections (per the brief: "do not make this section
 * larger") — a small real photo (license-verified, see amsterdamPhoto.ts)
 * as a quiet accent, not a full hero-sized visual.
 */
export async function AmsterdamTaxi() {
  const t = await getTranslations("AmsterdamTaxi");
  const locale = (await getLocale()) as "nl" | "en";
  const examples = [
    t("example1"),
    t("example2"),
    t("example3"),
    t("example4"),
    t("example5"),
    t("example6"),
  ];

  return (
    <section id="amsterdam-taxi" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-6 rounded-2xl border border-border bg-muted-background p-6 shadow-card sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">{t("eyebrow")}</p>
          <h2 className="mt-1 text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="mt-3 max-w-2xl text-foreground/90">{t("body")}</p>

          <p className="mt-4 text-sm font-semibold text-foreground">{t("fromLabel")}</p>
          <ul className="mt-2 grid gap-x-6 gap-y-1.5 text-sm text-muted sm:grid-cols-2">
            {examples.map((example) => (
              <li key={example} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-brand">
                  →
                </span>
                {example}
              </li>
            ))}
          </ul>

          <p className="mt-4 max-w-2xl text-sm text-foreground/90">{t("outro")}</p>

          <Link
            href="/#boeken"
            className="mt-5 inline-block rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
          >
            {t("cta")}
          </Link>
        </div>

        <div className="relative hidden aspect-[4/3] overflow-hidden rounded-xl border border-border shadow-card lg:block">
          <Image
            src={amsterdamPhoto.url}
            alt={amsterdamPhoto.alt[locale]}
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 33vw, 0vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
