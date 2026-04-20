import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    if (!productId) return NextResponse.json({ reviews: [] });

    const reviews = await prisma.review.findMany({
      where: { productId: parseInt(productId) },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error: any) {
    return NextResponse.json({ error: error.message, reviews: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, userId, userName, rating, comment } = await req.json();

    if (!productId || !userName || !rating || !comment) {
      return NextResponse.json({ error: "Barcha maydonlarni to'ldiring" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId: parseInt(productId),
        userId: userId ? parseInt(userId) : null,
        userName,
        rating: parseInt(rating),
        comment,
      },
    });

    // Update product rating average
    const allReviews = await prisma.review.findMany({ where: { productId: parseInt(productId) } });
    const avgRating = allReviews.reduce((s: number, r: any) => s + r.rating, 0) / allReviews.length;
    await prisma.product.update({
      where: { id: parseInt(productId) },
      data: { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length },
    });

    return NextResponse.json(review);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
