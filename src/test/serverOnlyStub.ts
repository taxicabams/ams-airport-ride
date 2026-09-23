// Stub for the "server-only" package in the Vitest/Node test
// environment. Next.js's bundler resolves "server-only" to a module
// that throws when pulled into a client bundle — a build-time guard
// that has no meaning under plain Node test execution (there's no
// "client bundle" to protect against here), so tests alias it to this
// empty module instead. See vitest.config.ts.
export {};
