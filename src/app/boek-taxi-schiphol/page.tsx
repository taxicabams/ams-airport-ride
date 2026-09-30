import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { TrustBar } from "@/components/home/TrustBar";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { Logo } from "@/components/ui/Logo";
import { PhoneIcon } from "@/components/ui/icons";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";
import { companyInfo } from "@/lib/companyInfo";
import { GENERAL_FAQ } from "@/lib/faq";

/**
 * Distraction-free Ads landing page — see layout.tsx's own note for why
 * this is a separate root route instead of a route inside the normal
 * site. Deliberately minimal chrome (own tiny header: logo + phone only,
 * no nav; own tiny footer: legal links + KvK only, no link farm) — the
 * booking itself is the only real action on the page. Reuses the real
 * BookingWidget/TrustBar components and real FAQ content, not a
 * simplified copy — so this can never drift out of sync with the real
 * pricing/flow the main site already uses and has already tested.
 */
export default async function AdsLandingPage() {
  const t = await getTranslations("Hero");
  const faqItems = GENERAL_FAQ.nl.slice(0, 4);

  return (
    <>
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/">
            <Logo variant="light" />
          </Link>
          {companyInfo.phone && (
            <TrackedLink
              event="phone_clicked"
              href={`tel:${companyInfo.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-text"
            >
              <PhoneIcon className="h-4 w-4" />
              {companyInfo.phone}
            </TrackedLink>
          )}
        </div>
      </header>

      <main>
        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6">
            <p className="inline-flex items-center gap-2 rounded-[10px] bg-brand px-4 py-2 font-mono text-base font-bold text-brand-foreground sm:text-lg">
              {t("heroPrice", { price: CHEAPEST_SCHIPHOL_PRICE })}
            </p>
            <h1 className="mt-4 font-heading text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl">
              Taxi van en naar Schiphol
            </h1>
            <p className="mt-3 text-ink-foreground-muted">
              Vaste prijs vooraf, geen toeslagen. Vul uw route in en bereken direct uw prijs — betalen doet u pas na
              de rit.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <BookingWidget />
        </div>

        <TrustBar />

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Veelgestelde vragen
          </h2>
          <div className="mt-6 divide-y divide-border overflow-hidden rounded-[18px] border border-border bg-surface">
            {faqItems.map((item) => (
              <details key={item.q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-medium text-foreground marker:content-none">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="shrink-0 text-lg leading-none text-brand-text transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface py-8 text-center text-xs text-muted">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 sm:px-6">
          <Link href="/voorwaarden" className="hover:text-foreground">
            Algemene voorwaarden
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Privacybeleid
          </Link>
        </div>
      </footer>
    </>
  );
}
