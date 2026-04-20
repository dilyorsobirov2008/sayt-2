import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
  return createHash('sha256').update(password + 'ashinde_salt_2024').digest('hex');
}

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, phone, email, password } = await req.json();

    if (!firstName || !email || !password) {
      return NextResponse.json({ error: "Ism, email va parol majburiy" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName: lastName || '',
        phone: phone || null,
        email,
        password: hashPassword(password),
      },
    });

    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
