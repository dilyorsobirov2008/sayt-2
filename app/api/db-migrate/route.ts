import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Create all tables using raw SQL (CREATE TABLE IF NOT EXISTS = safe to run multiple times)
    await sql`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" SERIAL PRIMARY KEY,
        "slug" TEXT UNIQUE,
        "name" TEXT UNIQUE NOT NULL,
        "nameRu" TEXT,
        "icon" TEXT NOT NULL DEFAULT '📁',
        "color" TEXT NOT NULL DEFAULT '#ffffff',
        "image" TEXT NOT NULL DEFAULT ''
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Brand" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT UNIQUE NOT NULL,
        "slug" TEXT UNIQUE NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" SERIAL PRIMARY KEY,
        "title_uz" TEXT,
        "name" TEXT,
        "nameRu" TEXT,
        "brand" TEXT,
        "category_name" TEXT,
        "categorySlug" TEXT,
        "price" DECIMAL(12,2) NOT NULL,
        "available" BOOLEAN NOT NULL DEFAULT true,
        "inStock" BOOLEAN NOT NULL DEFAULT true,
        "weight" TEXT,
        "image" TEXT DEFAULT 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
        "rating" FLOAT NOT NULL DEFAULT 5.0,
        "reviewCount" INTEGER NOT NULL DEFAULT 0,
        "specs" TEXT,
        "isNew" BOOLEAN NOT NULL DEFAULT false,
        "isFeatured" BOOLEAN NOT NULL DEFAULT false,
        "installmentMonths" INTEGER,
        "discountPercent" INTEGER,
        "creditMarkupPercent" INTEGER,
        "created_at" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS "Product_category_name_idx" ON "Product"("category_name")
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" SERIAL PRIMARY KEY,
        "firstName" TEXT NOT NULL,
        "lastName" TEXT NOT NULL DEFAULT '',
        "phone" TEXT,
        "email" TEXT UNIQUE NOT NULL,
        "password" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Review" (
        "id" SERIAL PRIMARY KEY,
        "productId" INTEGER NOT NULL,
        "userId" INTEGER,
        "userName" TEXT NOT NULL,
        "rating" INTEGER NOT NULL,
        "comment" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE,
        CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id")
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "ProductImage" (
        "id" SERIAL PRIMARY KEY,
        "productId" INTEGER NOT NULL,
        "url" TEXT NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "ProductVariant" (
        "id" SERIAL PRIMARY KEY,
        "productId" INTEGER NOT NULL,
        "color" TEXT NOT NULL,
        "colorName" TEXT NOT NULL,
        "colorNameRu" TEXT,
        "image" TEXT,
        CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "StorageVariant" (
        "id" SERIAL PRIMARY KEY,
        "productId" INTEGER NOT NULL,
        "ram" INTEGER NOT NULL,
        "storage" INTEGER NOT NULL,
        "price" DECIMAL(12,2) NOT NULL,
        "sku" TEXT,
        CONSTRAINT "StorageVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "customer" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "product" TEXT NOT NULL,
        "amount" FLOAT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'new',
        "date" TEXT NOT NULL,
        "address" TEXT,
        "region" TEXT,
        "district" TEXT,
        "floor" TEXT,
        "deliveryMethod" TEXT,
        "deliveryTerm" TEXT,
        "installment" INTEGER,
        "paymentMethod" TEXT NOT NULL DEFAULT 'cash',
        "telegramSent" BOOLEAN NOT NULL DEFAULT false,
        "telegramMessageId" INTEGER,
        "telegramChatId" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "InstallmentPlan" (
        "id" SERIAL PRIMARY KEY,
        "months" INTEGER UNIQUE NOT NULL,
        "interestPercent" FLOAT NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Visitor" (
        "id" SERIAL PRIMARY KEY,
        "fingerprint" TEXT UNIQUE NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS "Banner" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "titleRu" TEXT,
        "subtitle" TEXT,
        "subtitleRu" TEXT,
        "bg" TEXT,
        "badge" TEXT,
        "badgeRu" TEXT,
        "link" TEXT,
        "image" TEXT,
        "type" TEXT NOT NULL DEFAULT 'slider',
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Barcha jadvallar muvaffaqiyatli yaratildi yoki allaqachon mavjud edi',
    });
  } catch (err: any) {
    console.error('Migration error:', err);
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}
