import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/**
 * Security headers — found completely absent during a full audit pass
 * (no next.config headers() at all). Deliberately a safe, low-risk
 * baseline, not a Content-Security-Policy: this site loads GTM/GA4
 * scripts (components/marketing/Analytics.tsx, inline-executed) and
 * Google Places/Routes calls, and a CSP tight enough to matter but
 * wrong in even one directive can silently break booking (address
 * autocomplete) or tracking in production with no visible error — not
 * something to guess at without a real staging environment to verify
 * against. These five headers carry no such risk: they only restrict
 * things this site never uses anyway (being framed by another site,
 * MIME-sniffing, browser mic/camera/location access, leaking the full
 * referrer URL to third parties).
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
