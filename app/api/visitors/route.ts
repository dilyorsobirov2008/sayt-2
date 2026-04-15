import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const count = await prisma.visitor.count();
        return NextResponse.json({ count });
    } catch (e: any) {
        console.error('GET /api/visitors error:', e);
        return NextResponse.json({ count: 0, error: e.message || 'Xatolik' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const fingerprint = body.fingerprint;
        if (!fingerprint) return NextResponse.json({ error: 'fingerprint kerak' }, { status: 400 });

        // Agar bu fingerprint allaqachon mavjud bo'lsa, qayta qo'shmaymiz
        const existing = await prisma.visitor.findUnique({ where: { fingerprint } });
        if (existing) {
            const count = await prisma.visitor.count();
            return NextResponse.json({ count, new: false });
        }

        await prisma.visitor.create({ data: { fingerprint } });
        const count = await prisma.visitor.count();
        return NextResponse.json({ count, new: true });
    } catch (e: any) {
        console.error('POST /api/visitors error:', e);
        return NextResponse.json({ count: 0, error: e.message || 'Xatolik' }, { status: 500 });
    }
}
