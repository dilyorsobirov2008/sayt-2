import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';

// WebSocket polyfill for Node.js environment (Neon serverless requires it)
if (typeof globalThis.WebSocket === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const wsModule = require('ws');
    neonConfig.webSocketConstructor = wsModule;
  } catch {
    // ws not available in edge runtime, WebSocket should be available natively
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL?.trim();

  if (!connectionString) {
    console.error(
      '❌ DATABASE_URL environment variable topilmadi! ' +
      'Vercel dashboard → Settings → Environment Variables da DATABASE_URL ni tekshiring.'
    );
    // Build vaqtida xato bermasligi uchun oddiy client qaytarish
    return new PrismaClient();
  }

  try {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter } as any);
  } catch (error) {
    console.error('❌ Prisma client yaratishda xato:', error);
    throw error;
  }
}

// Singleton pattern — development da hot-reload muammosini bartaraf etish
export const prisma: PrismaClient =
  globalForPrisma.prisma ?? (globalForPrisma.prisma = createPrismaClient());
