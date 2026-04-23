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
        const userId = searchParams.get('userId');

        if (!id) return NextResponse.json({ error: "ID kerak" }, { status: 400 });

        // Avval sharhni topamiz
        const review = await prisma.review.findUnique({ where: { id: Number(id) } });
        if (!review) return NextResponse.json({ error: "Sharh topilmadi" }, { status: 404 });

        // Agar userId kelsa, faqat o'z sharhini o'chira oladi
        if (userId) {
            const parsedUserId = parseInt(userId, 10);
            if (!isNaN(parsedUserId) && review.userId !== parsedUserId) {
                return NextResponse.json({ error: "Bu sharhni o'chirishga ruxsat yo'q" }, { status: 403 });
            }
        }

        await prisma.review.delete({ where: { id: Number(id) } });

        // Mahsulot reytingini yangilash
        if (review.productId) {
            const remaining = await prisma.review.findMany({ where: { productId: review.productId } });
            const avgRating = remaining.length > 0
                ? remaining.reduce((acc: number, r: any) => acc + r.rating, 0) / remaining.length
                : 5.0;
            await prisma.product.update({
                where: { id: review.productId },
                data: { reviewCount: remaining.length, rating: Number(avgRating.toFixed(1)) }
            });
        }

        return NextResponse.json({ success: true });
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
