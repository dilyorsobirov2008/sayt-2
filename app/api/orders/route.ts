import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
        return NextResponse.json({ orders });
    } catch (e: any) {
        console.error('GET /api/orders error:', e);
        return NextResponse.json({ error: e.message || 'Buyurtmalarni olishda xatolik', orders: [] }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.userId) {
            return NextResponse.json({ error: "Unauthorized: Sotib olish uchun avval tizimga kiring." }, { status: 401 });
        }
        const user = await prisma.user.findUnique({ where: { id: parseInt(body.userId, 10) } });
        if (!user) {
            return NextResponse.json({ error: "Unauthorized: Noto'g'ri foydalanuvchi." }, { status: 401 });
        }

        const order = await prisma.order.create({
            data: {
                customer: body.customer,
                phone: body.phone,
                product: body.product,
                amount: body.amount,
                status: body.status || 'new',
                date: body.date,
                address: body.address || null,
                installment: body.installment || null,
                paymentMethod: body.paymentMethod || 'cash',
                telegramSent: body.telegramSent || false,
            },
        });
        return NextResponse.json(order);
    } catch (e: any) {
        console.error('POST /api/orders error:', e);
        return NextResponse.json({ error: e.message || 'Buyurtmani yaratishda xatolik' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 });

        const order = await prisma.order.update({
            where: { id: body.id },
            data: { status: body.status },
        });
        return NextResponse.json(order);
    } catch (e: any) {
        console.error('PUT /api/orders error:', e);
        return NextResponse.json({ error: e.message || 'Buyurtmani yangilashda xatolik' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 });

        await prisma.order.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('DELETE /api/orders error:', e);
        return NextResponse.json({ error: e.message || "Buyurtmani o'chirishda xatolik" }, { status: 500 });
    }
}
