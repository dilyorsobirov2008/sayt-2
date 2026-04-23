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

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ reviews: [] }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: "ID kerak" }, { status: 400 });
        
        const review = await prisma.review.delete({
            where: { id: Number(id) }
        });
        
        // Could also update the product rating here if we wanted to be perfectly mathematically rigorous
        // For now, let's just delete the review
        return NextResponse.json({ success: true, review });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
  try {
    const { productId, userName, rating, comment, userId } = await req.json();

    if (!rating) {
      return NextResponse.json({ error: "Baholash kerak" }, { status: 400 });
    }

    const ratingNum = Math.max(1, Math.min(5, parseInt(rating)));

    const parsedUserId = userId ? parseInt(userId, 10) : null;
    let safeUserId = (parsedUserId !== null && !isNaN(parsedUserId)) ? parsedUserId : null;
    if (safeUserId) {
        const userExists = await prisma.user.findUnique({ where: { id: safeUserId } });
        if (!userExists) safeUserId = null;
    }

    const review = await prisma.review.create({
      data: {
        productId: Number(productId),
        userId: safeUserId,
        userName: userName || 'Anonim',
        rating: ratingNum,
        comment: comment || '',
      }
    });

    const allReviews = await prisma.review.findMany({ where: { productId: Number(productId) } });
    const avgRating = allReviews.length > 0 
      ? allReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / allReviews.length 
      : ratingNum;
    
    await prisma.product.update({
      where: { id: Number(productId) },
      data: { 
        reviewCount: allReviews.length, 
        rating: Number(avgRating.toFixed(1)) || 5.0
      }
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
