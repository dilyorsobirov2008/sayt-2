import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return createHash('sha256').update(password + 'ashinde_salt_2024').digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email va parol kiriting' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== hashPassword(password)) {
      return NextResponse.json({ error: "Email yoki parol noto'g'ri" }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
