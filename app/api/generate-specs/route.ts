import { NextResponse } from 'next/server';

// ─── Fallback spec templates by product category ───────────────────────────
function getFallbackSpecs(productName: string) {
    const name = productName.toLowerCase();

    if (name.includes('iphone') || name.includes('samsung') || name.includes('xiaomi') ||
        name.includes('redmi') || name.includes('pixel') || name.includes('telefon') ||
        name.includes('phone') || name.includes('smartfon')) {
        return {
            specs: [
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
            ],
            advantages: [
                'Yuqori sifatli AMOLED ekran',
                'Kuchli protsessor bilan tez ishlaydi',
                'Professional kamera tizimi',
                'Uzoq muddatli batareya',
            ],
            seo_keywords: ['smartfon', 'telefon', 'mobil telefon', productName],
        };
    }

    if (name.includes('macbook') || name.includes('laptop') || name.includes('noutbuk') ||
        name.includes('notebook') || name.includes('asus') || name.includes('lenovo') ||
        name.includes('dell') || name.includes('hp ') || name.includes('acer')) {
        return {
            specs: [
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
            ],
            advantages: [
                'Yuqori unumdorlik va tezlik',
                'Yengil va ixcham dizayn',
                'Uzoq batareya hayoti',
                'Keng ekranli professional displey',
            ],
            seo_keywords: ['noutbuk', 'laptop', 'kompyuter', productName],
        };
    }

    if (name.includes('konditsioner') || name.includes('kondicioner') || name.includes('split') || 
        name.includes('sovutgich') || name.includes('inverter')) {
        return {
            specs: [
                { key: 'Turi', value: 'Inverterli split-sistema' },
                { key: 'Quvvat (BTU)', value: '12000 BTU' },
                { key: 'Energiya klassi', value: 'A++' },
                { key: 'Xona hajmi', value: '20-30 m²' },
                { key: 'Rejimlar', value: 'Sovutish, Isitish, Quritish' },
                { key: 'Shovqin darajasi', value: '22 dB (ichki blok)' },
                { key: 'Gaz turi', value: 'R-32 ekologik xavfsiz' },
                { key: 'Wi-Fi boshqaruv', value: 'Ha, ilovadan boshqarish' },
                { key: 'Filtr', value: 'HEPA antibakterial filtr' },
                { key: 'Kafolat', value: '3 yil kompressor, 1 yil umumiy' },
            ],
            advantages: [
                'Inverter texnologiyasi - 40% gacha elektr tejaydi',
                'Juda jim ishlaydi',
                'Issiq va sovuq rejimda ishlaydi',
                'Ekologik toza freon',
            ],
            seo_keywords: ['konditsioner', 'split sistema', 'sovutgich', productName],
        };
    }

    if (name.includes('kir yuvish') || name.includes('stiralka') || name.includes('washing') ||
        name.includes('стиральн')) {
        return {
            specs: [
                { key: 'Turi', value: 'Avtomat kir yuvish mashinasi' },
                { key: 'Sig\'imi', value: '8 kg' },
                { key: 'Energiya klassi', value: 'A+++' },
                { key: 'Aylanish tezligi', value: '1400 rpm' },
                { key: 'Motor turi', value: 'Inverter motor' },
                { key: 'Dasturlar soni', value: '16 ta dastur' },
                { key: 'Shovqin darajasi', value: '52 dB' },
                { key: 'Displey', value: 'LED raqamli displey' },
                { key: 'Suv sarfi', value: '52 litr/tsikl' },
                { key: 'Kafolat', value: '10 yil motor, 2 yil umumiy' },
            ],
            advantages: [
                'Katta hajm - 8 kg gacha kir yuvadi',
                'Inverter motor - tejamkor va jim',
                'Ko\'p dasturli yuvish rejimlari',
                'Energiya tejamkor A+++ klassi',
            ],
            seo_keywords: ['kir yuvish mashinasi', 'stiralka', 'avtomat', productName],
        };
    }

    if (name.includes('muzlatgich') || name.includes('xolodilnik') || name.includes('fridge') ||
        name.includes('refrigerator')) {
        return {
            specs: [
                { key: 'Turi', value: 'Ikki eshikli muzlatgich' },
                { key: 'Umumiy hajm', value: '340 litr' },
                { key: 'Muzlatkich hajmi', value: '100 litr' },
                { key: 'Energiya klassi', value: 'A+' },
                { key: 'Kompressor', value: 'Inverterli' },
                { key: 'Tizim', value: 'No Frost' },
                { key: 'Shovqin', value: '39 dB' },
                { key: 'O\'lchami', value: '175 x 60 x 65 sm' },
                { key: 'Rang', value: 'Kumush / Oq' },
                { key: 'Kafolat', value: '10 yil kompressor' },
            ],
            advantages: [
                'No Frost tizimi - muz qotmaydi',
                'Katta sig\'im - oila uchun ideal',
                'Inverter kompressor - tejamkor',
                'Jim ishlaydi',
            ],
            seo_keywords: ['muzlatgich', 'xolodilnik', 'sovutgich', productName],
        };
    }

    // Generic fallback
    return {
        specs: [
            { key: 'Mahsulot turi', value: 'Maishiy texnika' },
            { key: 'Holati', value: 'Yangi, original' },
            { key: 'Kafolat', value: '12 oy rasmiy kafolat' },
            { key: 'Kelib chiqishi', value: 'Original' },
        ],
        advantages: [
            'Rasmiy kafolat bilan',
            'Original sifat',
            'Tezkor yetkazib berish',
        ],
        seo_keywords: ['maishiy texnika', 'elektronika', productName],
    };
}

// ─── Full AI Prompt ─────────────────────────────────────────────────────────
function buildPrompt(productName: string) {
    return `Sen professional maishiy texnika eksperti va ecommerce AI assistentsan.

Vazifa:
Foydalanuvchi yuborgan mahsulot nomini tahlil qil.
Mahsulot qaysi turdagi texnika ekanini aniqlagin.
Nomidagi model va brenddan kelib chiqib realistik va mos xususiyatlar yarat.

Natijani faqat JSON formatda qaytar.

JSON formati:

{
  "product_type": "",
  "brand": "",
  "model": "",
  "short_description": "",
  "features": [
    {
      "name": "",
      "value": ""
    }
  ],
  "advantages": [],
  "seo_keywords": []
}

Qoidalar:
- Til: o'zbekcha
- Faqat JSON qaytar
- HTML ishlatma
- Emoji ishlatma
- Xususiyatlar maishiy texnikaga mos bo'lsin
- Realistik va professional yoz
- Xususiyatlar soni kamida 10 ta bo'lsin
- Agar aniq ma'lumot bo'lmasa, modelga mos taxminiy xususiyatlar yoz
- Energiya klassi, hajm, quvvat, texnologiya kabi parametrlarni qo'sh
- Afzalliklarni sotuv uslubida qisqa yoz

Foydalanuvchi yuborgan mahsulot nomi:
${productName}`;
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
                const prompt = buildPrompt(productName);

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
                        const fallback = getFallbackSpecs(productName);
                        return NextResponse.json({ 
                            specs: fallback.specs, 
                            advantages: fallback.advantages,
                            seo_keywords: fallback.seo_keywords,
                            fallback: true 
                        });
                    }
                    throw new Error(errMsg || 'Gemini API xatosi');
                }

                const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!textResponse) throw new Error('AI dan bo\'sh javob qaytdi!');

                const aiResult = JSON.parse(textResponse);

                // Map AI response to our format
                const specs = (aiResult.features || []).map((f: { name: string; value: string }) => ({
                    key: f.name,
                    value: f.value,
                }));

                return NextResponse.json({ 
                    specs,
                    product_type: aiResult.product_type || '',
                    brand: aiResult.brand || '',
                    model: aiResult.model || '',
                    short_description: aiResult.short_description || '',
                    advantages: aiResult.advantages || [],
                    seo_keywords: aiResult.seo_keywords || [],
                });

            } catch (apiError: any) {
                // Network error or quota → use fallback
                const msg: string = apiError?.message || '';
                const isQuota = msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('exceeded');
                if (isQuota || msg.includes('fetch')) {
                    console.warn('Gemini unreachable — using fallback specs');
                    const fallback = getFallbackSpecs(productName);
                    return NextResponse.json({ 
                        specs: fallback.specs, 
                        advantages: fallback.advantages,
                        seo_keywords: fallback.seo_keywords,
                        fallback: true 
                    });
                }
                throw apiError;
            }
        }

        // No API key → use fallback immediately
        console.warn('No GEMINI_API_KEY — using fallback specs');
        const fallback = getFallbackSpecs(productName);
        return NextResponse.json({ 
            specs: fallback.specs, 
            advantages: fallback.advantages,
            seo_keywords: fallback.seo_keywords,
            fallback: true 
        });

    } catch (error: any) {
        console.error('Error generating specs:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
