import { getTranslations } from "next-intl/server";
import { CheckIcon } from "@/components/ui/icons";

/**
 * A single horizontal line of real, provable claims — deliberately NOT
 * four cards with titles/bodies (that's `Trust`/the old `TrustBadges`,
 * still used more compactly elsewhere). This is the client's own exact
 * spec: "compacte trust bar" directly under the booking widget, four
 * short items, nothing invented.
 */
export async function TrustBar() {
  const t = await getTranslations("TrustBar");
  const items = [t("item1"), t("item2"), t("item3"), t("item4")];

  return (
    <section className="border-y border-border bg-muted-background/60 py-4">
      <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm font-medium text-foreground/80 sm:px-6">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-1.5">
            <CheckIcon className="h-4 w-4 shrink-0 text-brand" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
