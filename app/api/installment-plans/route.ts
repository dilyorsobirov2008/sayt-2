import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {

    try {
        const plans = await prisma.installmentPlan.findMany({
            orderBy: { months: 'asc' },
        });
        return NextResponse.json({ plans });
    } catch (e: any) {
        console.error('GET /api/installment-plans error:', e);
        return NextResponse.json({ error: e.message || 'Rejalarni olishda xatolik', plans: [] }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.months || body.months < 1) {
            return NextResponse.json({ error: 'Oy soni kerak' }, { status: 400 });
        }

        const plan = await prisma.installmentPlan.upsert({
            where: { months: parseInt(body.months) },
            update: {
                interestPercent: parseFloat(body.interestPercent) || 0,
                isActive: body.isActive !== false,
            },
            create: {
                months: parseInt(body.months),
                interestPercent: parseFloat(body.interestPercent) || 0,
                isActive: body.isActive !== false,
            },
        });
        return NextResponse.json(plan);
    } catch (e: any) {
        console.error('POST /api/installment-plans error:', e);
        return NextResponse.json({ error: e.message || 'Saqlashda xatolik yuz berdi' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    if (!body.id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 });

    const plan = await prisma.installmentPlan.update({
        where: { id: parseInt(body.id) },
        data: {
            months: body.months ? parseInt(body.months) : undefined,
            interestPercent: body.interestPercent !== undefined ? parseFloat(body.interestPercent) : undefined,
            isActive: body.isActive !== undefined ? body.isActive : undefined,
        },
    });
    return NextResponse.json(plan);
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 });

    await prisma.installmentPlan.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
}
