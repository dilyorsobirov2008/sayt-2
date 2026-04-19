import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

let dbUrl = process.env.DATABASE_URL;

// Prisma Neon serverless muhitida odatiy TCP ulanish uchun url oxiriga pgbouncer=true qo'shish kerak bo'lishi mumkin
if (dbUrl && dbUrl.includes('-pooler.') && !dbUrl.includes('pgbouncer=true')) {
  dbUrl = dbUrl + (dbUrl.includes('?') ? '&' : '?') + 'pgbouncer=true';
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

