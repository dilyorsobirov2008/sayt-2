import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const plans = [
            { months: 3, interestPercent: 0, isActive: true },
            { months: 6, interestPercent: 12, isActive: true },
            { months: 12, interestPercent: 24, isActive: true },
            { months: 24, interestPercent: 40, isActive: true },
        ];

        for (const plan of plans) {
            await prisma.installmentPlan.upsert({
                where: { months: plan.months },
                update: { interestPercent: plan.interestPercent, isActive: plan.isActive },
                create: { months: plan.months, interestPercent: plan.interestPercent, isActive: plan.isActive },
            });
        }

        return NextResponse.json({ success: true, message: "Installment plans have been seeded successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: "Failed to seed installment plans" }, { status: 500 });
    }
}
