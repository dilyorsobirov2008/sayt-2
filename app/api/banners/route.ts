import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const count = await prisma.banner.count();
        if (count === 0) {
            const seedBanners = [
                // 3 Slider Banners
                {
                    title: "Samsung Galaxy S24 Ultra",
                    titleRu: "Samsung Galaxy S24 Ultra",
                    subtitle: "Eng kuchli smartfon — chegirmada!",
                    subtitleRu: "Самый мощный смартфон — со скидкой!",
                    bg: "from-yellow-400 to-yellow-600",
                    badge: "−30%",
                    badgeRu: "−30%",
                    link: "/catalog?category=smartphones",
                    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80"
                },
                {
                    title: "MacBook Pro M3",
                    titleRu: "MacBook Pro M3",
                    subtitle: "24 oyga muddatli to'lov bilan!",
                    subtitleRu: "В рассрочку на 24 месяца!",
                    bg: "from-slate-800 to-slate-600",
                    badge: "24 oy",
                    badgeRu: "24 мес",
                    link: "/catalog?category=laptops",
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
                },
                {
                    title: "Apple Watch Ultra 2",
                    titleRu: "Apple Watch Ultra 2",
                    subtitle: "Eng zo'r smartwatch — hozir buyurtma bering!",
                    subtitleRu: "Лучшие смарт-часы — заказывайте сейчас!",
                    bg: "from-gray-900 to-gray-700",
                    badge: "Yangi",
                    badgeRu: "Новинка",
                    link: "/catalog?category=smartwatches",
                    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"
                },
                // 4. Promo Top
                {
                    title: "S24 Ultra",
                    titleRu: "S24 Ultra",
                    subtitle: "Samsung Galaxy",
                    subtitleRu: "Samsung Galaxy",
                    bg: "from-gray-900 to-gray-700",
                    badge: "−30%",
                    badgeRu: "−30%",
                    link: "/catalog?category=smartphones&brand=Samsung",
                    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&q=80"
                },
                // 5. Promo Bottom
                {
                    title: "3-6-12",
                    titleRu: "3-6-12",
                    subtitle: "Muddatli to'lov",
                    subtitleRu: "Рассрочка",
                    bg: "from-yellow-400 to-yellow-300",
                    badge: "oy",
                    badgeRu: "мес",
                    link: "/catalog",
                    image: ""
                }
            ];
            await prisma.banner.createMany({ data: seedBanners });
        }

        const banners = await prisma.banner.findMany({
            orderBy: { id: 'asc' },
        });
        return NextResponse.json({ banners });
    } catch (error) {
        console.error('Banners GET error:', error);
        return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        if (body.action === 'seed') {
            await prisma.banner.deleteMany({});
            const seedBanners = [
                {
                    title: "Samsung Galaxy S24 Ultra",
                    titleRu: "Samsung Galaxy S24 Ultra",
                    subtitle: "Eng kuchli smartfon — chegirmada!",
                    subtitleRu: "Самый мощный смартфон — со скидкой!",
                    bg: "from-yellow-400 to-yellow-600",
                    badge: "−30%",
                    badgeRu: "−30%",
                    link: "/catalog?category=smartphones",
                    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80"
                },
                {
                    title: "MacBook Pro M3",
                    titleRu: "MacBook Pro M3",
                    subtitle: "24 oyga muddatli to'lov bilan!",
                    subtitleRu: "В рассрочку на 24 месяца!",
                    bg: "from-slate-800 to-slate-600",
                    badge: "24 oy",
                    badgeRu: "24 мес",
                    link: "/catalog?category=laptops",
                    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
                },
                {
                    title: "Apple Watch Ultra 2",
                    titleRu: "Apple Watch Ultra 2",
                    subtitle: "Eng zo'r smartwatch — hozir buyurtma bering!",
                    subtitleRu: "Лучшие смарт-часы — заказывайте сейчас!",
                    bg: "from-gray-900 to-gray-700",
                    badge: "Yangi",
                    badgeRu: "Новинка",
                    link: "/catalog?category=smartwatches",
                    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"
                }
            ];
            await prisma.banner.createMany({ data: seedBanners });
            return NextResponse.json({ success: true, message: 'Banners seeded' });
        }

        const banner = await prisma.banner.create({
            data: {
                title: body.title,
                titleRu: body.titleRu || body.title,
                subtitle: body.subtitle,
                subtitleRu: body.subtitleRu || body.subtitle,
                bg: body.bg || 'from-yellow-400 to-yellow-600',
                badge: body.badge,
                badgeRu: body.badgeRu || body.badge,
                link: body.link || '/catalog',
                image: body.image || '',
            }
        });

        return NextResponse.json(banner, { status: 201 });
    } catch (error) {
        console.error('Banners POST error:', error);
        return NextResponse.json({ error: "Failed to create banner" }, { status: 500 });
    }
}
