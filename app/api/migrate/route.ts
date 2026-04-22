import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const results: string[] = [];

    // ProductImage jadvalini yaratish
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ProductImage" (
        "id" SERIAL NOT NULL,
        "productId" INTEGER NOT NULL,
        "url" TEXT NOT NULL,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id")
      );
    `);
    results.push('✅ ProductImage jadvali yaratildi (yoki allaqachon mavjud)');

    // Foreign key qo'shish (agar yo'q bo'lsa)
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'ProductImage_productId_fkey'
        ) THEN
          ALTER TABLE "ProductImage"
            ADD CONSTRAINT "ProductImage_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `);
    results.push('✅ ProductImage foreign key qo\'shildi');

    // ProductVariant jadvalini yaratish
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ProductVariant" (
        "id" SERIAL NOT NULL,
        "productId" INTEGER NOT NULL,
        "color" TEXT NOT NULL,
        "colorName" TEXT NOT NULL,
        "colorNameRu" TEXT,
        "image" TEXT,
        CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
      );
    `);
    results.push('✅ ProductVariant jadvali yaratildi (yoki allaqachon mavjud)');

    // Foreign key qo'shish (agar yo'q bo'lsa)
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE constraint_name = 'ProductVariant_productId_fkey'
        ) THEN
          ALTER TABLE "ProductVariant"
            ADD CONSTRAINT "ProductVariant_productId_fkey"
            FOREIGN KEY ("productId") REFERENCES "Product"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `);
    results.push('✅ ProductVariant foreign key qo\'shildi');

    return NextResponse.json({
      success: true,
      message: 'Migration muvaffaqiyatli bajarildi!',
      results,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
