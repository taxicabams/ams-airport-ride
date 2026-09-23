import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Match Next.js's own env-file precedence (.env.local overrides .env) —
// plain `dotenv/config` only ever reads `.env`, so the Prisma CLI would
// otherwise see a stale/placeholder DATABASE_URL from `.env` even when
// the real value lives in `.env.local`, the file the app's own README
// instructions point people to.
config({ path: ".env" });
config({ path: ".env.local", override: true });

// Used by the Prisma CLI (generate/migrate/studio) to find DATABASE_URL.
// The running app doesn't read this file — it builds its own adapter
// from process.env.DATABASE_URL in src/lib/db.ts instead (see the note
// there on why Prisma 7 splits these two).
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
