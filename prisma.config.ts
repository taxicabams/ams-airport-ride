import "dotenv/config";
import { defineConfig, env } from "prisma/config";

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
