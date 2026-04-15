import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// Force dynamic rendering to prevent build-time static generation failures
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Build-time guard: if DATABASE_URL is missing, return empty success response
        if (!process.env.DATABASE_URL) {
            console.warn('⚠️ [Build/Runtime Guard] DATABASE_URL missing. Skipping query.');
            return NextResponse.json({ brands: [], warning: 'DATABASE_URL missing' });
        }

        const brands = await prisma.brand.findMany({ 
            orderBy: { id: 'asc' } 
        });
        return NextResponse.json({ brands });
    } catch (e: any) {
        console.error('GET /api/brands error:', e);
        // Fallback to empty array to prevent frontend crashes
        return NextResponse.json({ 
            brands: [], 
            error: 'Brendlarni yuklashda xatolik yuz berdi. Ma\'lumotlar bazasini tekshiring.' 
        }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        
        if (!body.name?.trim()) {
            return NextResponse.json({ error: 'Brend nomi kiritilishi shart' }, { status: 400 });
        }

        const name = body.name.trim();
        const slug = body.slug?.trim() || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const brand = await prisma.brand.upsert({
            where: { name },
            update: { slug },
            create: { name, slug },
        });

        return NextResponse.json(brand);
    } catch (e: any) {
        console.error('POST /api/brands error:', e);
        return NextResponse.json({ 
            error: e.message || 'Brendni saqlashda xatolik yuz berdi' 
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const idString = searchParams.get('id');
        
        if (!idString) {
            return NextResponse.json({ error: 'Brend ID-si kerak' }, { status: 400 });
        }

        const id = parseInt(idString);
        if (isNaN(id)) {
            return NextResponse.json({ error: 'Noto\'g\'ri Brend ID-si' }, { status: 400 });
        }

        await prisma.brand.delete({ 
            where: { id } 
        });

        return NextResponse.json({ success: true, message: 'Brend muvaffaqiyatli o\'chirildi' });
    } catch (e: any) {
        console.error('DELETE /api/brands error:', e);
        return NextResponse.json({ 
            error: e.message || 'Brendni o\'chirishda xatolik yuz berdi' 
        }, { status: 500 });
    }
}
