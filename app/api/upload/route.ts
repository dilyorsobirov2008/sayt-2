import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { base64 } = await req.json();
    if (!base64) {
      return NextResponse.json({ error: 'Base64 rasm kerak' }, { status: 400 });
    }
    const url = await uploadToCloudinary(base64);
    return NextResponse.json({ url });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
