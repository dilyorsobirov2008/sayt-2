import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    if (productId) {
      const reviews = await prisma.review.findMany({
        where: { productId: Number(productId) },
        orderBy: { createdAt: 'desc' }
      });
      return NextResponse.json({ reviews });
    }

    return NextResponse.json({ reviews: [] });
  } catch (error) {
    return NextResponse.json({ reviews: [] }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, userName, rating, comment, userId } = await req.json();

    if (!rating) {
      return NextResponse.json({ error: "Baholash kerak" }, { status: 400 });
    }

    const ratingNum = Math.max(1, Math.min(5, parseInt(rating)));

    const review = await prisma.review.create({
      data: {
        productId: Number(productId),
        userId: userId ? Number(userId) : null,
        userName: userName || 'Anonim',
        rating: ratingNum,
        comment: comment || '',
      }
    });

    const allReviews = await prisma.review.findMany({ where: { productId: Number(productId) } });
    const avgRating = allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / allReviews.length;
    
    await prisma.product.update({
      where: { id: Number(productId) },
      data: { 
        reviewCount: allReviews.length, 
        rating: Number(avgRating.toFixed(1)) 
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
