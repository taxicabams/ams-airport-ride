import { describe, expect, it } from "vitest";
import nl from "../../messages/nl.json";
import en from "../../messages/en.json";

/**
 * NL and EN must expose exactly the same message keys. Without this,
 * a key added to one file and forgotten in the other only surfaces as
 * a missing-translation error (or worse, silently falls back) at
 * runtime in whichever locale was missed — this test catches it at
 * `npm test` time instead.
 */
function collectKeyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, val]) =>
    collectKeyPaths(val, prefix ? `${prefix}.${key}` : key)
  );
}

describe("i18n message parity (nl.json vs en.json)", () => {
  it("has the exact same set of keys in both locales", () => {
    const nlKeys = collectKeyPaths(nl).sort();
    const enKeys = collectKeyPaths(en).sort();

    const missingInEn = nlKeys.filter((k) => !enKeys.includes(k));
    const missingInNl = enKeys.filter((k) => !nlKeys.includes(k));

    expect(missingInEn, `Keys present in nl.json but missing in en.json: ${missingInEn.join(", ")}`).toEqual([]);
    expect(missingInNl, `Keys present in en.json but missing in nl.json: ${missingInNl.join(", ")}`).toEqual([]);
  });
});
