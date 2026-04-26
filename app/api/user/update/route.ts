import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function hashPassword(password: string): string {
    return createHash('sha256').update(password + 'ashinde_salt_2024').digest('hex');
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, firstName, lastName, phone, email, currentPassword } = body;

        if (!id) {
            return NextResponse.json({ error: "Foydalanuvchi ID si berilmadi" }, { status: 400 });
        }

        if (!currentPassword) {
            return NextResponse.json({ error: "Ma'lumotni saqlash uchun joriy parolni kiritish majburiy" }, { status: 400 });
        }

        // Fetch the user from the database
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id, 10) }
        });

        if (!user) {
            return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
        }

        // Verify the current password
        const currentPasswordHashed = hashPassword(currentPassword);
        if (user.password !== currentPasswordHashed) {
            return NextResponse.json({ error: "Joriy parol noto'g'ri kiritildi" }, { status: 401 });
        }

        // Optional: Ensure the new email doesn't belong to another user
        if (email !== user.email) {
            const existingEmail = await prisma.user.findUnique({ where: { email } });
            if (existingEmail) {
                return NextResponse.json({ error: "Bu email allaqachon band" }, { status: 400 });
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                firstName: firstName || user.firstName,
                lastName: lastName !== undefined ? lastName : user.lastName,
                phone: phone !== undefined ? phone : user.phone,
                email: email || user.email,
            }
        });

        return NextResponse.json({
            id: updatedUser.id,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phone: updatedUser.phone,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
    }
}
