import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware wrappers around Next.js's Link/router APIs. Using these
 * (instead of next/link, next/navigation) means every internal link
 * automatically gets the right locale prefix (or no prefix for Dutch).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
