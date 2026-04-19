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
      total: data.length,
      details: [] as { row: number; status: 'success' | 'error'; message: string; name?: string }[]
    };

    // Process rows
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNum = i + 2; // Excel qator raqami (1-qator sarlavha)

      try {
        // Turli ustun nomlarini qo'llab-quvvatlash
        const title_uz = row.name || row.title_uz || row['Mahsulot nomi'] || row['Nomi'] || row['name'] || '';
        const price = parseFloat(row.price || row['Narxi'] || row['narx'] || row['Price'] || 0);
        const category_name = row.category || row.category_name || row['Kategoriya'] || row['kategoriya'] || row['Category'] || 'Boshqa';
        const image = row.image_url || row.image || row['Rasm URL'] || row['rasm'] || row['Image'] || '';
        const brand = row.brand || row['Brend'] || row['Brand'] || '';
        const weight = row.weight || row['Vazni'] || row['Weight'] || '';
        const description = row.description || row['Tavsifi'] || row['tavsif'] || row['Description'] || '';

        // Validatsiya
        if (!title_uz || !String(title_uz).trim()) {
          throw new Error('Mahsulot nomi kiritilmagan');
        }
        if (!price || isNaN(price) || price <= 0) {
          throw new Error('Narx noto\'g\'ri yoki kiritilmagan');
        }

        // Auto-create category
        const catName = String(category_name).trim();
        await prisma.category.upsert({
          where: { name: catName },
          update: {},
          create: { 
            name: catName,
            slug: catName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          },
        });

        // Create product
        await prisma.product.create({
          data: {
            title_uz: String(title_uz).trim(),
            name: String(title_uz).trim(),
            price,
            category_name: catName,
            image: image ? String(image).trim() : null,
            brand: brand ? String(brand).trim() : null,
            weight: weight ? String(weight).trim() : null,
            available: true,
            inStock: true,
          },
        });

        results.success++;
        results.details.push({
          row: rowNum,
          status: 'success',
          message: 'Muvaffaqiyatli qo\'shildi',
          name: String(title_uz).trim(),
        });
      } catch (err: any) {
        results.errors++;
        results.details.push({
          row: rowNum,
          status: 'error',
          message: err.message || 'Noma\'lum xato',
          name: row.name || row.title_uz || row['Mahsulot nomi'] || `Qator ${rowNum}`,
        });
        console.error(`Import row ${rowNum} error:`, err);
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
