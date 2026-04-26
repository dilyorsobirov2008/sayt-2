import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// In-memory cache for sales count
const globalForCache = global as unknown as { salesCache: Map<string, { count: number, expiry: number }> };
const salesCache = globalForCache.salesCache || new Map<string, { count: number, expiry: number }>();
if (process.env.NODE_ENV !== 'production') globalForCache.salesCache = salesCache;

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const searchParams = req.nextUrl.searchParams;
        const name = searchParams.get('name');

        if (!name) {
            return NextResponse.json({ error: 'Mahsulot nomi kiritilmagan' }, { status: 400 });
        }

        const cacheKey = `sales_${id}`;
        const cached = salesCache.get(cacheKey);
        const now = Date.now();

        if (cached && cached.expiry > now) {
            return NextResponse.json({ count: cached.count });
        }

        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        let actualSales = await prisma.order.count({
            where: {
                product: {
                    contains: name,
                    mode: 'insensitive' // to handle different cases just in case
                },
                createdAt: {
                    gte: oneMonthAgo
                }
            }
        });

        // Fallback logic
        if (actualSales < 12) {
            actualSales = Math.floor(Math.random() * 34) + 12; // Random between 12 and 45
        }

        // Cache for 10 minutes
        const TTL = 10 * 60 * 1000;
        salesCache.set(cacheKey, { count: actualSales, expiry: now + TTL });

        return NextResponse.json({ count: actualSales });
    } catch (error: any) {
        console.error('Sales API error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
