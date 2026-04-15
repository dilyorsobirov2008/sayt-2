import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import dotenv from 'dotenv';

dotenv.config();
neonConfig.webSocketConstructor = ws;

async function checkDb() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool as any);
  const prisma = new PrismaClient({ adapter });

  try {
    const brands = await prisma.brand.findMany();
    const categories = await prisma.category.findMany();
    console.log('Brands in DB:', brands);
    console.log('Categories in DB:', categories);
  } catch (e) {
    console.error('Error checking DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
