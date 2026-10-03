import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { companyInfo } from "@/lib/companyInfo";
import { buildAlternates } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";

type Locale = "nl" | "en";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  // "of een zakelijke aanvraag"/"or a business enquiry" removed — the
  // client's explicit instruction is a pure B2C focus, no B2B framing
  // anywhere on the site, even in a one-line meta description.
  const base = locale === "nl"
    ? { title: "Contact", description: "Neem contact op met AMS Airport Ride voor vragen over uw boeking." }
    : { title: "Contact", description: "Get in touch with AMS Airport Ride for questions about your booking." };
  return { ...base, alternates: buildAlternates(locale as AppLocale, "/contact") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as Locale;
  const hasAnyContact = companyInfo.phone || companyInfo.email || companyInfo.whatsapp;

  return (
    <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-foreground">
        {l === "nl" ? "Contact" : "Contact"}
      </h1>
      <p className="mt-4 text-foreground/90">
        {l === "nl"
          ? "Wilt u een rit boeken? Dat kan direct via onze boekingscalculator op de homepage — binnen een paar minuten heeft u een vaste prijs en een bevestigde rit."
          : "Want to book a ride? You can do that directly through our booking calculator on the homepage — within a few minutes you'll have a fixed price and a confirmed ride."}
      </p>

      {/* Only rendered once real contact details exist — see
          companyInfo.ts's null-until-real convention. No "coming soon"
          placeholder text: a page that simply doesn't mention contact
          methods it doesn't have yet reads as complete, not unfinished. */}
      {hasAnyContact && (
        <div className="mt-6 rounded-xl border border-border p-5">
          <ul className="space-y-2 text-foreground">
            {companyInfo.phone && (
              <li>
                {l === "nl" ? "Telefoon" : "Phone"}:{" "}
                <a href={`tel:${companyInfo.phone}`} className="font-medium text-brand-text">
                  {companyInfo.phone}
                </a>
              </li>
            )}
            {companyInfo.whatsapp && (
              <li>
                WhatsApp:{" "}
                <a
                  href={`https://wa.me/${companyInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-brand-text"
                >
                  {companyInfo.whatsapp}
                </a>
              </li>
            )}
            {companyInfo.email && (
              <li>
                Email:{" "}
                <a href={`mailto:${companyInfo.email}`} className="font-medium text-brand-text">
                  {companyInfo.email}
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      <Link
        href="/#boeken"
        className="mt-6 inline-block rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition hover:brightness-95"
      >
        {l === "nl" ? "Nu boeken" : "Book now"}
      </Link>
    </section>
  );
}
