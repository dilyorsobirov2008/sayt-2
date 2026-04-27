import { NextResponse } from 'next/server';

// ─── Fallback spec templates by product category ───────────────────────────
function getFallbackSpecs(productName: string) {
    const name = productName.toLowerCase();

    if (name.includes('iphone') || name.includes('samsung') || name.includes('xiaomi') ||
        name.includes('redmi') || name.includes('pixel') || name.includes('telefon') ||
        name.includes('phone') || name.includes('smartfon')) {
        return [
            { key: 'Operatsion tizim', value: 'Android / iOS' },
            { key: 'Ekran', value: '6.5 dyuym, AMOLED, 120Hz' },
            { key: 'Protsessor', value: 'Snapdragon / A-seriya' },
            { key: 'Asosiy kamera', value: '50 MP + 12 MP + 10 MP' },
            { key: 'Old kamera', value: '12 MP' },
            { key: 'Batareya', value: '4500 mAh' },
            { key: 'RAM', value: '8 GB' },
            { key: 'Xotira', value: '128 GB / 256 GB' },
            { key: 'SIM kartalar', value: 'Dual SIM (nano-SIM)' },
            { key: 'Ulanish', value: '5G, Wi-Fi 6, Bluetooth 5.2, NFC' },
        ];
    }

    if (name.includes('macbook') || name.includes('laptop') || name.includes('noutbuk') ||
        name.includes('notebook') || name.includes('asus') || name.includes('lenovo') ||
        name.includes('dell') || name.includes('hp ') || name.includes('acer')) {
        return [
            { key: 'Protsessor', value: 'Intel Core i7 / Apple M2' },
            { key: 'RAM', value: '16 GB DDR5' },
            { key: 'Xotira', value: '512 GB SSD' },
            { key: 'Ekran', value: '15.6 dyuym, IPS, Full HD' },
            { key: 'Grafik karta', value: 'Intel Iris Xe / NVIDIA RTX' },
            { key: 'Batareya', value: '72 Wh (12 soat)' },
            { key: 'Operatsion tizim', value: 'Windows 11 / macOS' },
            { key: 'Vazn', value: '1.8 kg' },
            { key: 'Portlar', value: 'USB-C, USB-A x2, HDMI, SD card' },
            { key: 'Wi-Fi', value: 'Wi-Fi 6 (802.11ax)' },
        ];
    }

    if (name.includes('ipad') || name.includes('tablet') || name.includes('plankshet')) {
        return [
            { key: 'Ekran', value: '10.9 dyuym, Liquid Retina' },
            { key: 'Protsessor', value: 'Apple A14 / Snapdragon' },
            { key: 'RAM', value: '4 GB' },
            { key: 'Xotira', value: '64 GB / 256 GB' },
            { key: 'Kamera', value: '12 MP orqa, 12 MP old' },
            { key: 'Batareya', value: '28.65 Wh (10 soat)' },
            { key: 'Ulanish', value: 'Wi-Fi 6, Bluetooth 5.0, 5G (opsional)' },
            { key: 'Operatsion tizim', value: 'iPadOS / Android' },
        ];
    }

    if (name.includes('airpod') || name.includes('qulaqchin') || name.includes('earphone') ||
        name.includes('headphone') || name.includes('nasushnik') || name.includes('naushnik') ||
        name.includes('tws') || name.includes('buds')) {
        return [
            { key: 'Ulanish', value: 'Bluetooth 5.3' },
            { key: 'Musiqa vaqti', value: '6 soat (ko\'p oʻzgaruvchi bilan 30 soat)' },
            { key: 'Shovqinni blokirovka qilish', value: 'Faol ANC' },
            { key: 'Mikrofon', value: 'Ichki mikrofon bor' },
            { key: 'Zaryad qutisi', value: 'Wireless & USB-C' },
            { key: 'Suv o\'tkazmasligi', value: 'IPX4' },
            { key: 'Kodek', value: 'AAC, SBC' },
        ];
    }

    if (name.includes('soat') || name.includes('watch') || name.includes('chasy')) {
        return [
            { key: 'Ekran', value: '1.9 dyuym, AMOLED, Always-On' },
            { key: 'Protsessor', value: 'ARM Cortex' },
            { key: 'Batareya', value: '300 mAh (5-7 kun)' },
            { key: 'Ulanish', value: 'Bluetooth 5.0, GPS' },
            { key: 'Sensorlar', value: 'Yurak urishi, SpO2, Akselerometr' },
            { key: 'Suv o\'tkazmasligi', value: '5 ATM (50 metr)' },
            { key: 'Mos kelishi', value: 'iOS va Android' },
        ];
    }

    if (name.includes('tv') || name.includes('televizor') || name.includes('smart tv')) {
        return [
            { key: 'Ekran o\'lchami', value: '55 dyuym' },
            { key: 'Ekran turi', value: '4K UHD QLED / OLED' },
            { key: 'Yangilanish tezligi', value: '120 Hz' },
            { key: 'Smart TV', value: 'Android TV / Tizen' },
            { key: 'Ovoz', value: '20W + 20W Dolby Atmos' },
            { key: 'Portlar', value: 'HDMI x3, USB x2, ARC' },
            { key: 'Wi-Fi', value: 'Wi-Fi 5, Bluetooth 5.0' },
            { key: 'HDR', value: 'HDR10+, Dolby Vision' },
        ];
    }

    // Generic electronics fallback
    return [
        { key: 'Mahsulot turi', value: 'Elektronika' },
        { key: 'Kafolat', value: '12 oy' },
        { key: 'Holati', value: 'Yangi' },
        { key: 'Kelib chiqishi', value: 'Original' },
    ];
}

// ─── Main handler ───────────────────────────────────────────────────────────
export async function POST(request: Request) {
    try {
        const { productName } = await request.json();
        if (!productName) {
            return NextResponse.json({ error: 'Product nomi kiritilmagan!' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;

        // Try Gemini API if key is available
        if (apiKey) {
            try {
                const prompt = `Siz elektronika do'koni uchun mahsulot xususiyatlarini (specs) generatsiya qiluvchi yordamchisiz.
Mahsulot nomi: "${productName}"
Vazifa: Ushbu mahsulotning eng muhim texnik xususiyatlarini O'zbek tilida chiqarib bering.
Diqqat: Faqatgina JSON array qaytaring, hech qanday qo'shimcha so'zlar yoki markdown kerak emas.
Har bir obyekt faqat 'key' va 'value' xususiyatlariga ega bo'lsin.
Masalan: [{"key": "Ekran", "value": "6.7 dyuym, AMOLED"}, {"key": "Xotira", "value": "256 GB"}]`;

                const response = await fetch(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: { responseMimeType: 'application/json' },
                        }),
                    }
                );

                const data = await response.json();

                // If quota exceeded or any API error → fall through to fallback
                if (!response.ok) {
                    const errMsg: string = data.error?.message || '';
                    const isQuota =
                        response.status === 429 ||
                        errMsg.toLowerCase().includes('quota') ||
                        errMsg.toLowerCase().includes('exceeded');

                    if (isQuota) {
                        console.warn('Gemini quota exceeded — using fallback specs');
                        const specs = getFallbackSpecs(productName);
                        return NextResponse.json({ specs, fallback: true });
                    }
                    throw new Error(errMsg || 'Gemini API xatosi');
                }

                const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!textResponse) throw new Error('AI dan boʻsh javob qaytdi!');

                const specs = JSON.parse(textResponse);
                return NextResponse.json({ specs });

            } catch (apiError: any) {
                // Network error or quota → use fallback
                const msg: string = apiError?.message || '';
                const isQuota = msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('exceeded');
                if (isQuota || msg.includes('fetch')) {
                    console.warn('Gemini unreachable — using fallback specs');
                    const specs = getFallbackSpecs(productName);
                    return NextResponse.json({ specs, fallback: true });
                }
                throw apiError;
            }
        }

        // No API key → use fallback immediately
        console.warn('No GEMINI_API_KEY — using fallback specs');
        const specs = getFallbackSpecs(productName);
        return NextResponse.json({ specs, fallback: true });

    } catch (error: any) {
        console.error('Error generating specs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
