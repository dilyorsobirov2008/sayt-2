import { NextResponse } from 'next/server';
import { banners } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ banners });
}
