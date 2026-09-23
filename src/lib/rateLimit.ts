import "server-only";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic sweep so abandoned buckets (one per distinct IP+route) don't
// accumulate forever in a long-running process — each entry is tiny, but
// unbounded growth under sustained traffic from many IPs is still worth
// avoiding.
const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanup(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/**
 * Best-effort client IP from standard proxy headers. Behind Vercel or any
 * reverse proxy this is `x-forwarded-for`; falls back to a constant when
 * neither header is present (e.g. a direct connection in local dev) so
 * rate limiting still degrades to "one shared bucket" instead of throwing.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * A simple in-memory fixed-window rate limiter — enough to blunt naive,
 * scripted abuse of a public endpoint (in particular /api/places/*, which
 * bills per request against the client's Google Cloud project) on a
 * single-instance deployment. It resets on every deploy/restart and isn't
 * shared across instances in a multi-instance deployment; a shared store
 * (e.g. Upstash/Redis) would be the upgrade if/when the client deploys
 * behind multiple instances — real infra to provision, not something to
 * fake here.
 */
export function checkRateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  cleanup(now);

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/** Test-only: clears all buckets so tests don't leak state into each other. */
export function _resetRateLimitStateForTests() {
  buckets.clear();
}
