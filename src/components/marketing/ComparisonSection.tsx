type Locale = "nl" | "en";

/**
 * Honest alternative-comparison section — a real, proven marketing/trust
 * pattern researched directly from a competitor's own Ads landing page
 * (schipholride.nl) at the client's request ("vergelijk verschillende
 * websites die op verschillende manieren met ads werken"). Deliberately
 * NOT a copy of their content: their version cites specific numbers
 * (Schiphol parking €45-200/week, train €5-20) that I could not quickly
 * and reliably re-verify as currently accurate myself, and their own
 * taxi column lists things AMS Airport Ride can't back up (Stripe
 * payment, AeroDataBox flight-tracking integration, 4 vehicle classes).
 * Copying their specific figures would mean repeating a claim neither
 * confirmed nor sourced — exactly what this project avoids everywhere
 * else. Every line below is a qualitative, unfalsifiable-by-omission
 * fact (no cost figures invented), and — matching their own honest
 * touch of admitting a real downside for their own option — this
 * includes one real "con" for AMS Airport Ride too (cost vs. public
 * transport), not just uncritical self-promotion.
 */
export function ComparisonSection({ locale }: { locale: Locale }) {
  const t =
    locale === "nl"
      ? {
          eyebrow: "Vergelijking",
          title: "Taxi, openbaar vervoer of eigen auto?",
          subtitle: "Wat past het beste bij uw reis?",
          taxiTitle: "AMS Airport Ride",
          taxiBadge: "Deur tot deur",
          taxiPros: [
            "Vaste prijs vooraf — geen taxameter-verrassingen",
            "Deur tot deur, geen overstappen of bagage sjouwen",
            "Wij houden rekening met uw vluchtnummer",
            "Betaal pas na de rit",
          ],
          taxiCons: ["Duurder dan het openbaar vervoer"],
          ptTitle: "Openbaar vervoer",
          ptPros: ["Goedkoopste optie", "Frequente verbindingen vanuit grote steden"],
          ptCons: ["Overstappen en bagage zelf sjouwen", "Minder flexibel bij vertraging of een late aankomst"],
          carTitle: "Eigen auto + parkeren",
          carPros: ["Vertrouwd, volledige controle"],
          carCons: [
            "Parkeerkosten lopen op tijdens uw hele reis",
            "Auto staat stil terwijl u weg bent",
            "Zelf rijden na een lange vlucht",
          ],
        }
      : {
          eyebrow: "Comparison",
          title: "Taxi, public transport, or your own car?",
          subtitle: "Which option fits your trip best?",
          taxiTitle: "AMS Airport Ride",
          taxiBadge: "Door-to-door",
          taxiPros: [
            "Fixed price upfront — no meter surprises",
            "Door-to-door, no changes or hauling luggage",
            "We take your flight number into account",
            "Pay only after your ride",
          ],
          taxiCons: ["More expensive than public transport"],
          ptTitle: "Public transport",
          ptPros: ["Cheapest option", "Frequent connections from major cities"],
          ptCons: ["Changes and hauling your own luggage", "Less flexible with delays or a late arrival"],
          carTitle: "Own car + parking",
          carPros: ["Familiar, full control"],
          carCons: [
            "Parking costs add up for your entire trip",
            "Car sits idle while you're away",
            "Driving yourself after a long flight",
          ],
        };

  const columns = [
    { title: t.ptTitle, pros: t.ptPros, cons: t.ptCons, highlight: false },
    { title: t.taxiTitle, pros: t.taxiPros, cons: t.taxiCons, highlight: true, badge: t.taxiBadge },
    { title: t.carTitle, pros: t.carPros, cons: t.carCons, highlight: false },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-text">{t.eyebrow}</p>
        <h2 className="mt-2 font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {t.title}
        </h2>
        <p className="mt-2 text-muted">{t.subtitle}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {columns.map((col) => (
          <div
            key={col.title}
            className={
              col.highlight
                ? "relative rounded-[18px] border-2 border-brand bg-brand/5 p-5"
                : "rounded-[18px] border border-border bg-surface p-5"
            }
          >
            {col.highlight && col.badge && (
              <span className="absolute -top-3 left-5 rounded-[10px] bg-brand px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wide text-brand-foreground">
                {col.badge}
              </span>
            )}
            <h3 className="font-bold text-foreground">{col.title}</h3>
            <ul className="mt-3 space-y-1.5 text-sm">
              {col.pros.map((pro) => (
                <li key={pro} className="flex gap-2 text-foreground/90">
                  <span className="shrink-0 text-success">+</span>
                  {pro}
                </li>
              ))}
              {col.cons.map((con) => (
                <li key={con} className="flex gap-2 text-muted">
                  <span className="shrink-0">–</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
