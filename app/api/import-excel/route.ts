import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { base64 } = await req.json();
    
    if (!base64) {
      return NextResponse.json({ error: 'Fayl yuborilmadi' }, { status: 400 });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(base64.split(',')[1] || base64, 'base64');
    
    // Parse Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet) as any[];

    if (!data.length) {
      return NextResponse.json({ error: 'Fayl bo\'sh' }, { status: 400 });
    }

    const results = {
      success: 0,
      errors: 0,
      details: [] as string[]
    };

    // Process rows
    for (const row of data) {
      try {
        const title_uz = row.title_uz || row['Mahsulot nomi'] || row['Nomi'];
        const price = parseFloat(row.price || row['Narxi'] || 0);
        const available = row.available === true || row.available === 1 || row['Mavjudligi'] === 'Ha';
        const weight = row.weight || row['Vazni'] || '';
        const category_name = row.category_name || row['Kategoriya'] || 'Boshqa';

        if (!title_uz) {
          throw new Error('Mahsulot nomi kiritilmagan');
        }

        // Auto-create category
        await prisma.category.upsert({
          where: { name: category_name },
          update: {},
          create: { name: category_name },
        });

        // Create or update product
        await prisma.product.create({
          data: {
            title_uz,
            price,
            available,
            weight,
            category_name,
          },
        });

        results.success++;
      } catch (err: any) {
        results.errors++;
        results.details.push(`Qator xatoligi: ${err.message}`);
        console.error('Import row error:', err);
      }
    }

    return NextResponse.json({
      message: `${results.success} ta mahsulot muvaffaqiyatli import qilindi. ${results.errors} ta xatolik.`,
      ...results
    });
  } catch (error: any) {
    console.error('Excel import error:', error);
    return NextResponse.json({ error: 'Faylni o\'qishda xatolik yuz berdi: ' + error.message }, { status: 500 });
  }
}
