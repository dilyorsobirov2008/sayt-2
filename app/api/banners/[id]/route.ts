import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();

        const banner = await prisma.banner.update({
            where: { id },
            data: {
                title: body.title,
                titleRu: body.titleRu,
                subtitle: body.subtitle,
                subtitleRu: body.subtitleRu,
                bg: body.bg,
                badge: body.badge,
                badgeRu: body.badgeRu,
                link: body.link,
                image: body.image,
            }
        });

        return NextResponse.json(banner);
    } catch (error) {
        console.error('Banners PUT error:', error);
        return NextResponse.json({ error: "Failed to update banner" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.banner.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Banners DELETE error:', error);
        return NextResponse.json({ error: "Failed to delete banner" }, { status: 500 });
    }
}
