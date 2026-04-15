import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const categories = await prisma.category.findMany({ orderBy: { id: 'asc' } });
        return NextResponse.json({ categories });
    } catch (e: any) {
        console.error('GET /api/categories error:', e);
        return NextResponse.json({ error: e.message || 'Kategoriyalarni olishda xatolik', categories: [] }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // ── Seed Action ──
        if (body.action === 'seed') {
            const defaultCats = [
                { slug: 'smartphones', name: "Smartfonlar", nameRu: "Смартфоны", icon: "📱", color: "#3B82F6", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&q=80" },
                { slug: 'feature-phones', name: "Tugmali telefonlar", nameRu: "Кнопочные телефоны", icon: "☎️", color: "#6366F1", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&q=80" },
                { slug: 'laptops', name: "Noutbuklar", nameRu: "Ноутбуки", icon: "💻", color: "#10B981", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80" },
                { slug: 'headphones', name: "Naushniklar", nameRu: "Наушники", icon: "🎧", color: "#F59E0B", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&q=80" },
                { slug: 'monitors', name: "Monitorlar", nameRu: "Мониторы", icon: "🖥️", color: "#EC4899", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80" },
                { slug: 'blenders', name: "Blenderlar", nameRu: "Блендеры", icon: "🍹", color: "#F43F5E", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&q=80" },
                { slug: 'watches', name: "Qo'l soatlar", nameRu: "Наручные часы", icon: "⌚", color: "#8B5CF6", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" },
                { slug: 'smartwatches', name: "Smartwatchlar", nameRu: "Смарт часы", icon: "⌚", color: "#06B6D4", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&q=80" },
                { slug: 'accessories', name: "Aksessuarlar", nameRu: "Аксессуары", icon: "🔌", color: "#64748B", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80" },
                { slug: 'tablets', name: "Planshetlar", nameRu: "Планшеты", icon: "📱", color: "#F59E0B", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&q=80" },
                { slug: 'cameras', name: "Kameralar", nameRu: "Камеры", icon: "📷", color: "#EF4444", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&q=80" },
                { slug: 'gaming', name: "O'yin qurilmalari", nameRu: "Игровые устройства", icon: "🎮", color: "#8B5CF6", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80" }
            ];
            for (const cat of defaultCats) {
                await prisma.category.upsert({ where: { slug: cat.slug }, update: cat, create: cat });
            }
            return NextResponse.json({ success: true, count: defaultCats.length });
        }
        
        if (!body.slug || !body.name) {
            return NextResponse.json({ error: 'Slug va Nom kiritilishi shart' }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: {
                slug: body.slug.trim(),
                name: body.name.trim(),
                nameRu: body.nameRu?.trim() || body.name.trim(),
                icon: body.icon || '📁',
                color: body.color || '#ffffff',
                image: body.image || '',
            },
        });
        return NextResponse.json(category);
    } catch (e: any) {
        console.error('POST /api/categories error:', e);
        if (e.code === 'P2002') {
            return NextResponse.json({ error: 'Bunday slug bilan kategoriya allaqachon mavjud' }, { status: 400 });
        }
        return NextResponse.json({ error: e.message || 'Saqlashda xatolik yuz berdi' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body.id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 });

        const category = await prisma.category.update({
            where: { id: Number(body.id) },
            data: {
                slug: body.slug?.trim(),
                name: body.name?.trim(),
                nameRu: body.nameRu?.trim() || body.name?.trim(),
                icon: body.icon,
                color: body.color,
                image: body.image,
            },
        });
        return NextResponse.json(category);
    } catch (e: any) {
        console.error('PUT /api/categories error:', e);
        if (e.code === 'P2002') {
            return NextResponse.json({ error: 'Bunday slug bilan kategoriya allaqachon mavjud' }, { status: 400 });
        }
        return NextResponse.json({ error: e.message || 'Yangilashda xatolik yuz berdi' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID kerak' }, { status: 400 });

    await prisma.category.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
}
