import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const p = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: true,
        storageVariants: true,
      },
    });

    if (!p) return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });

    const product = {
      id: p.id,
      name: p.name || p.title_uz || '',
      nameRu: p.nameRu || p.name || '',
      brand: p.brand || '',
      category: (p as any).category?.slug || p.categorySlug || p.category_name || '',
      price: Number(p.price),
      image: p.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
      images: (p as any).images.map((img: any) => img.url),
      variants: (p as any).variants.map((v: any) => ({
        id: v.id,
        color: v.color,
        colorName: v.colorName,
        colorNameRu: v.colorNameRu,
        image: v.image,
      })),
      storageVariants: (p as any).storageVariants ? (p as any).storageVariants.map((sv: any) => ({
        id: sv.id,
        ram: Number(sv.ram),
        storage: Number(sv.storage),
        price: Number(sv.price),
        sku: sv.sku,
      })) : [],
      rating: p.rating || 0,
      reviewCount: p.reviewCount || 0,
      inStock: p.inStock ?? true,
      isNew: p.isNew || false,
      discountPercent: p.discountPercent || null,
      specs: p.specs ? (typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs) : undefined,
    };

    return NextResponse.json({ product });
  } catch (error: any) {
    console.error('Product detail error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
