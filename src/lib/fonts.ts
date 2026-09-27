import { Bricolage_Grotesque, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

/**
 * Shared font loader instances — extracted into their own module because
 * having two separate root layouts (`[locale]/layout.tsx` and the
 * standalone `boek-taxi-schiphol/layout.tsx` Ads landing page) each call
 * the *same* next/font/google loaders independently triggered a real,
 * reproducible Next.js build bug (`next/font`: "Cannot read properties
 * of null (reading '1')" inside the webpack font loader) — a known class
 * of issue with next/font when the identical font+args pair is
 * instantiated at more than one call site. Next.js's own docs recommend
 * exactly this fix: put the loader calls in one shared file and import
 * the `.variable` from there everywhere, instead of calling the loader
 * again per layout.
 */
export const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["700", "800"],
});
export const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
export const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const fontVariables = `${bricolage.variable} ${plexSans.variable} ${plexMono.variable}`;
