import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ orders: [] });
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId, 10) }
        });

        if (!user) {
            return NextResponse.json({ orders: [] });
        }

        const fullName = `${user.firstName} ${user.lastName}`.trim();
        let orders = [];

        if (user.phone) {
            let cleanPhone = user.phone.replace(/\D/g, '');
            let phoneQuery = cleanPhone.slice(-9); // get the real number without code
            
            orders = await prisma.order.findMany({
                where: {
                    OR: [
                        { phone: { contains: phoneQuery } },
                        { customer: fullName }
                    ]
                },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            orders = await prisma.order.findMany({
                where: { customer: fullName },
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json({ orders });
    } catch (e: any) {
        console.error('GET /api/orders/my error:', e);
        return NextResponse.json({ error: e.message || 'Xatolik', orders: [] }, { status: 500 });
    }
}
