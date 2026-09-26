import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CarIcon, VanIcon, ArrowRightIcon } from "@/components/ui/icons";
import { PERSONENAUTO_MAX_PASSENGERS, BUS_MAX_PASSENGERS } from "@/lib/pricing/vehicle";

/**
 * v10 rebuild — real vehicles, real capacity (imported from the pricing
 * engine, never hand-typed), a link into the booking widget, and now a
 * dedicated eyebrow/title + a distinct icon per vehicle (CarIcon for
 * Comfort, VanIcon for Van — both cards previously used the identical
 * sedan icon, a real visual bug fixed here). A real photo drops in here
 * the moment one exists (see vehiclePhoto.ts) — the icon is a
 * placeholder, never a stock or AI-generated image.
 *
 * Names are deliberately "Comfort"/"Van", NOT "Comfort Electric"/"Van
 * Electric" as the client's own mockup shows — the fleet's electric
 * status has never been confirmed, and the client's own brief says to
 * use the plain correct naming when it isn't ("Gebruik alleen 'Electric'
 * als de daadwerkelijke voertuigen elektrisch zijn"). Flagged in the
 * report; a one-word change in messages/*.json once confirmed.
 */
export async function VehiclesSimple() {
  const t = await getTranslations("Vehicles");
  // Capacity strings come from the Booking namespace (same "1-4"/"5-7"
  // format used in the booking widget's own vehicle picker), so the
  // marketing section and the real flow never phrase capacity slightly
  // differently from each other.
  const tb = await getTranslations("Booking");

  const vehicles = [
    {
      Icon: CarIcon,
      title: t("sedanTitle"),
      capacity: tb("vehiclePersonenautoCapacity", { max: PERSONENAUTO_MAX_PASSENGERS }),
    },
    {
      Icon: VanIcon,
      title: t("busTitle"),
      capacity: tb("vehicleBusCapacity", { max: BUS_MAX_PASSENGERS }),
    },
  ];

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-brand-text">{t("eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">{t("title")}</h2>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {vehicles.map(({ Icon, title, capacity }) => (
          <Link
            key={title}
            href="/#boeken"
            className="group flex items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40 hover:shadow-card-hover"
          >
            <span className="flex items-center gap-4">
              <Icon className="h-10 w-10 shrink-0 text-brand-text" />
              <span>
                <span className="block text-lg font-bold text-foreground">{title}</span>
                <span className="block text-sm text-muted">{capacity}</span>
              </span>
            </span>
            <ArrowRightIcon className="h-4 w-4 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  );
}
