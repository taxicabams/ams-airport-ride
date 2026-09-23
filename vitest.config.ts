import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Next.js's bundler gives "server-only" special build-time
      // meaning (throw if pulled into a client bundle); under plain
      // Node test execution that has no meaning, so tests get a no-op
      // stub instead — see src/test/serverOnlyStub.ts.
      "server-only": path.resolve(__dirname, "./src/test/serverOnlyStub.ts"),
    },
  },
});
