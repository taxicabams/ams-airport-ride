import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { TrustBar } from "@/components/home/TrustBar";
import { ComparisonSection } from "@/components/marketing/ComparisonSection";
import { TrackedLink } from "@/components/marketing/TrackedLink";
import { Logo } from "@/components/ui/Logo";
import { PhoneIcon } from "@/components/ui/icons";
import { CHEAPEST_SCHIPHOL_PRICE } from "@/lib/pricing";
import { companyInfo } from "@/lib/companyInfo";
import { GENERAL_FAQ } from "@/lib/faq";

/**
 * English counterpart of `src/app/boek-taxi-schiphol/page.tsx` — same
 * component, same reasoning, see that file's own note. Kept as a
 * near-literal English translation of the same copy rather than a
 * fresh rewrite, so both language versions make the exact same honest
 * claims (fixed price, pay after your ride, no online payment).
 */
export default async function AdsLandingPageEn() {
  const t = await getTranslations("Hero");
  const faqItems = GENERAL_FAQ.en.slice(0, 4);

  return (
    <>
      {/* pt-[env(safe-area-inset-top)]: same fix as Header.tsx (see that
          file's comment) — a separate root layout, needs it
          independently. */}
      <header className="border-b border-border bg-surface pt-[env(safe-area-inset-top,0px)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/en">
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
              Taxi to and from Schiphol
            </h1>
            <p className="mt-3 text-ink-foreground-muted">
              Fixed price upfront, no surcharges. Enter your route and see your price right away — pay only after
              your ride.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <BookingWidget />
        </div>

        <TrustBar />

        <ComparisonSection locale="en" />

        <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-foreground">
            Frequently asked questions
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
          <Link href="/en/voorwaarden" className="hover:text-foreground">
            Terms &amp; conditions
          </Link>
          <Link href="/en/privacy" className="hover:text-foreground">
            Privacy policy
          </Link>
        </div>
      </footer>
    </>
  );
}
