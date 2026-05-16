import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { CreateOrderRequest, PaymentMethod, OrderStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

// ─── GET /api/orders ──────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ orders });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Buyurtmalarni olishda xatolik';
    console.error('[GET /api/orders]', e);
    return NextResponse.json({ error: message, orders: [] }, { status: 500 });
  }
}

// ─── POST /api/orders ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body: CreateOrderRequest = await req.json();

    // userId ixtiyoriy — mehmon foydalanuvchilar ham buyurtma bera oladi
    if (body.userId) {
      const parsed = parseInt(body.userId, 10);
      if (!isNaN(parsed)) {
        const user = await prisma.user.findUnique({ where: { id: parsed } });
        if (!user) {
          console.warn(`[POST /api/orders] userId=${parsed} topilmadi — mehmon sifatida davom etiladi`);
        }
      }
    }

    const order = await prisma.order.create({
      data: {
        customer:      body.customer,
        phone:         body.phone,
        product:       body.product,
        amount:        body.amount,
        status:        (body.status ?? 'new') as OrderStatus,
        date:          body.date,
        address:       body.address ?? null,
        installment:   body.installment ?? null,
        paymentMethod: (body.paymentMethod ?? 'cash') as PaymentMethod,
        telegramSent:  body.telegramSent ?? false,
      },
    });

    return NextResponse.json({ success: true, order });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Buyurtmani yaratishda xatolik';
    console.error('[POST /api/orders]', e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ─── PUT /api/orders ──────────────────────────────────────────────────────────

interface UpdateOrderBody {
  id: string;
  status: OrderStatus;
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const body: UpdateOrderBody = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: body.id },
      data: { status: body.status },
    });
    return NextResponse.json({ success: true, order });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Buyurtmani yangilashda xatolik';
    console.error('[PUT /api/orders]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE /api/orders ───────────────────────────────────────────────────────

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID kerak' }, { status: 400 });
    }

    await prisma.order.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Buyurtmani o'chirishda xatolik";
    console.error('[DELETE /api/orders]', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
