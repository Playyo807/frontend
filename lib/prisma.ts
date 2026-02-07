// lib/prisma.ts
import { PrismaClient } from "../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Parse connection string manually to avoid adapter bug
const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString: connectionString,
  // Fix SSL issues with Supabase
  ssl: {
    rejectUnauthorized: false, // Accept Supabase certificates
  },
});

const adapter = new PrismaPg(pool);

declare global {
  var prisma: PrismaClient;
}

export const prisma = global.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
