import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { productName } = await request.json();
        if (!productName) {
            return NextResponse.json({ error: 'Product nomi kiritilmagan!' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API kaliti (.env) da topilmadi!' }, { status: 500 });
        }

        const prompt = `Siz elektronika do'koni uchun mahsulot xususiyatlarini (specs) generatsiya qiluvchi yordamchisiz.
Mahsulot nomi: "${productName}"
Vazifa: Ushbu mahsulotning eng muhim texnik xususiyatlarini O'zbek tilida chiqarib bering.
Diqqat: Faqatgina JSON array qaytaring, hech qanday qo'shimcha so'zlar yoki markdown kerak emas.
Har bir obyekt faqat 'key' va 'value' xususiyatlariga ega bo'lsin.
Masalan: [{"key": "Ekran", "value": "6.7 dyuym, AMOLED"}, {"key": "Xotira", "value": "256 GB"}]`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error?.message || 'Gemini API dan ma\'lumot olishda xato yuz berdi. API kalitini tekshiring!');
        }

        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse) {
            throw new Error('AI dan bo\'sh javob qaytdi!');
        }

        try {
            const specs = JSON.parse(textResponse);
            return NextResponse.json({ specs });
        } catch (parseError) {
            console.error('JSON Parse error:', textResponse);
            return NextResponse.json({ error: 'AI qaytargan ma\'lumotni o\'qib bo\'lmadi. Qaytadan urinib ko\'ring.' }, { status: 500 });
        }

    } catch (error: any) {
        console.error('Error generating specs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
