import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 dropped the old "just read DATABASE_URL from schema.prisma"
// runtime behavior — PrismaClient now always needs an explicit driver
// adapter (here: @prisma/adapter-pg, which talks to any Postgres,
// including Supabase's). This is orthogonal to prisma.config.ts, which
// only the CLI (generate/migrate) reads.
//
// Standard Next.js pattern: stash the client on `globalThis` so dev's
// hot-reloading reuses one instance/connection pool instead of creating
// a new one on every file save.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
