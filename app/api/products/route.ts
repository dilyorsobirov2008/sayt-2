import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const dbProducts = await prisma.product.findMany({
      include: { category: true },
      orderBy: { created_at: 'desc' },
    });

    // Map DB fields to frontend Product interface
    const products = dbProducts.map((p: any) => ({
      id: p.id,
      name: p.name || p.title_uz || '',
      nameRu: p.nameRu || p.name || p.title_uz || '',
      brand: p.brand || '',
      category: p.category?.slug || p.categorySlug || p.category_name || '',
      price: Number(p.price),
      image: p.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
      rating: p.rating || 0,
      reviewCount: p.reviewCount || 0,
      inStock: p.inStock ?? p.available ?? true,
      isNew: p.isNew || false,
      isFeatured: p.isFeatured || false,
      installmentMonths: p.installmentMonths || null,
      discountPercent: p.discountPercent || null,
      creditMarkupPercent: p.creditMarkupPercent || null,
      specs: p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : undefined,
      // Keep raw fields for admin
      title_uz: p.title_uz,
      category_name: p.category_name,
      available: p.available,
      weight: p.weight,
      created_at: p.created_at,
    }));

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Mahsulotlarni yuklashda xatolik yuz berdi', products: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both admin dashboard format and simple format
    const name = body.name || body.title_uz;
    const price = parseFloat(body.price) || 0;
    const categoryName = body.category_name || body.category || '';
    const categorySlug = body.categorySlug || body.category || '';

    // Ensure category exists if category_name provided
    if (categoryName) {
      await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName, slug: categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-') },
      });
    }

    const product = await prisma.product.create({
      data: {
        title_uz: body.title_uz || name,
        name: name,
        nameRu: body.nameRu || name,
        brand: body.brand || null,
        category_name: categoryName || null,
        categorySlug: categorySlug || null,
        price: price,
        available: body.available !== undefined ? Boolean(body.available) : (body.inStock !== undefined ? Boolean(body.inStock) : true),
        inStock: body.inStock !== undefined ? Boolean(body.inStock) : true,
        weight: body.weight || null,
        image: body.image || body.imageUrl || null,
        isNew: body.isNew || false,
        isFeatured: body.isFeatured || false,
        installmentMonths: body.installmentMonths ? parseInt(body.installmentMonths) : null,
        discountPercent: body.discountPercent ? parseInt(body.discountPercent) : null,
        creditMarkupPercent: body.creditMarkupPercent ? parseInt(body.creditMarkupPercent) : null,
        specs: body.specs ? JSON.stringify(body.specs) : null,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Mahsulotni yaratishda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 });

    const categoryName = body.category_name || body.category || undefined;
    const categorySlug = body.categorySlug || body.category || undefined;

    // Ensure category exists
    if (categoryName) {
      await prisma.category.upsert({
        where: { name: categoryName },
        update: {},
        create: { name: categoryName, slug: categorySlug || categoryName.toLowerCase().replace(/\s+/g, '-') },
      });
    }

    const product = await prisma.product.update({
      where: { id: parseInt(body.id) },
      data: {
        name: body.name,
        nameRu: body.nameRu,
        brand: body.brand,
        category_name: categoryName,
        categorySlug: categorySlug,
        price: body.price ? parseFloat(body.price) : undefined,
        image: body.image,
        inStock: body.inStock,
        available: body.available ?? body.inStock,
        isNew: body.isNew,
        isFeatured: body.isFeatured,
        installmentMonths: body.installmentMonths ? parseInt(body.installmentMonths) : undefined,
        discountPercent: body.discountPercent !== undefined ? parseInt(body.discountPercent) || null : undefined,
        creditMarkupPercent: body.creditMarkupPercent !== undefined ? parseInt(body.creditMarkupPercent) || null : undefined,
        specs: body.specs ? JSON.stringify(body.specs) : undefined,
      },
    });

    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Mahsulotni yangilashda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 });

    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || "Mahsulotni o'chirishda xatolik yuz berdi" }, { status: 500 });
  }
}
