import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CarIcon } from "@/components/ui/icons";
import { PERSONENAUTO_MAX_PASSENGERS, BUS_MAX_PASSENGERS } from "@/lib/pricing/vehicle";

/**
 * v9 rebuild — no marketing blocks, no gradient photo boxes: just the
 * two real vehicles, their real capacity (imported from the pricing
 * engine, never hand-typed), and a link into the booking widget. A real
 * photo drops in here the moment one exists (see vehiclePhoto.ts) — the
 * plain icon is a placeholder, never a stock or AI-generated image.
 */
export async function VehiclesSimple() {
  const t = await getTranslations("Vehicles");
  // Capacity strings come from the Booking namespace (same "1-4"/"5-7"
  // format used in the booking widget's own vehicle picker), so the
  // marketing section and the real flow never phrase capacity slightly
  // differently from each other.
  const tb = await getTranslations("Booking");

  const vehicles = [
    { title: t("sedanTitle"), capacity: tb("vehiclePersonenautoCapacity", { max: PERSONENAUTO_MAX_PASSENGERS }) },
    { title: t("busTitle"), capacity: tb("vehicleBusCapacity", { max: BUS_MAX_PASSENGERS }) },
  ];

  return (
    <section className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <div className="grid gap-4 sm:grid-cols-2">
        {vehicles.map((vehicle) => (
          <Link
            key={vehicle.title}
            href="/#boeken"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-brand/40"
          >
            <CarIcon className="h-10 w-10 shrink-0 text-brand" />
            <span>
              <span className="block text-lg font-bold text-foreground">{vehicle.title}</span>
              <span className="block text-sm text-muted">{vehicle.capacity}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
