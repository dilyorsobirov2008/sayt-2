import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8516821604:AAEW4IT9CXtB6R9hcoeRcnsJygCVzQ-IhOo';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, surname, phone, location, items, total, cashTotal, creditTotal, chatId, paymentMethod, installmentMonths, interestPercent } = body;

        // Tovar ro'yxatini shakllantirish
        const itemsList = items.map((item: { name: string; quantity: number; price: number; cashPrice?: number }, i: number) =>
            `  ${i + 1}. ${item.name} × ${item.quantity} — ${item.price.toLocaleString()} so'm`
        ).join('\n');

        // Lokatsiyani shakllantirish
        const hasCoordinates = location?.lat && location?.lng;
        const locationText = hasCoordinates
            ? `📍 <a href="https://www.google.com/maps?q=${location.lat},${location.lng}">Lokatsiyani ko'rish</a>`
            : location?.text
                ? `📍 ${location.text}`
                : '📍 Ko\'rsatilmagan';

        // Yetkazib berish uchun Google Maps havolasi
        const mapLink = hasCoordinates
            ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
            : location?.text
                ? `https://www.google.com/maps/search/${encodeURIComponent(location.text)}`
                : '';

        // Chat ID larni .env dan olish
        const personalChatId = process.env.TELEGRAM_CHAT_ID || '7351189083';
        const groupChatId = process.env.TELEGRAM_GROUP_ID || '-1003854963252';
        const possibleChatIds = [
            personalChatId,
            groupChatId,
        ].filter(Boolean);

        const paymentMethodText = paymentMethod === 'credit'
            ? `🏦 <b>Bo'lib to'lash (${installmentMonths} oyga, +${interestPercent || 0}%)</b>`
            : `💵 <b>Naqd pul</b>`;

        // Kredit ma'lumotlari
        const creditInfo = paymentMethod === 'credit' && cashTotal && creditTotal
            ? `\n💵 <b>Naqd narx:</b> ${cashTotal.toLocaleString()} so'm\n🏦 <b>Kredit narx:</b> ${creditTotal.toLocaleString()} so'm (+${interestPercent || 0}% ustama)\n📊 <b>Oylik to'lov:</b> ${Math.ceil(creditTotal / installmentMonths).toLocaleString()} so'm × ${installmentMonths} oy`
            : '';

        const message = `🛒 <b>YANGI BUYURTMA!</b>
        
👤 <b>Ism:</b> ${name} ${surname || ''}
📞 <b>Telefon:</b> ${phone}
📍 <b>Manzil:</b> ${locationText}

🛍 <b>Buyurtma mahsulotlari:</b>
${itemsList}

💰 <b>Umumiy narx:</b> ${total.toLocaleString()} so'm
💳 <b>To'lov usuli:</b> ${paymentMethodText}
${creditInfo}

⏰ ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;

        // Inline keyboard tugmalar - Yetkazib berish → Xaritaga o'tsin
        const inlineKeyboard: any[][] = [];
        
        if (mapLink) {
            inlineKeyboard.push([
                { text: '🚚 Yetkazib berish', url: mapLink }
            ]);
        }

        let success = false;
        let lastError = '';
        const errors: string[] = [];

        // Har bir chat ID ni navbat bilan tekshirib yuborib ko'ramiz
        for (const targetChatId of possibleChatIds) {
            try {
                console.log(`📡 [Telegram] Yuborilmoqda: chat_id=${targetChatId}`);
                const telegramRes = await fetch(`${TELEGRAM_API}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: targetChatId,
                        text: message,
                        parse_mode: 'HTML',
                        disable_web_page_preview: false,
                        reply_markup: inlineKeyboard.length > 0 ? {
                            inline_keyboard: inlineKeyboard,
                        } : undefined,
                    }),
                });

                const telegramData = await telegramRes.json();
                console.log(`📡 [Telegram] Javob (chat_id=${targetChatId}):`, JSON.stringify(telegramData, null, 2));

                if (telegramData.ok) {
                    success = true;
                    console.log(`✅ [Telegram] Muvaffaqiyatli yuborildi: chat_id=${targetChatId}`);
                    break;
                } else {
                    lastError = telegramData.description || 'Noma\'lum xato';
                    errors.push(`chat_id=${targetChatId}: ${lastError}`);
                    console.error(`❌ [Telegram] Xato (chat_id=${targetChatId}):`, lastError);
                    
                    if (telegramData.error_code === 400 && targetChatId.startsWith('-100')) {
                        console.warn(`💡 [Maslahat] Chat ID ${targetChatId} superguruh uchun bo'lishi mumkin, lekin bot u yerda admin emas yoki ID noto'g'ri.`);
                    }
                }
            } catch (fetchErr) {
                const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
                errors.push(`chat_id=${targetChatId}: fetch xato - ${errMsg}`);
                console.error(`❌ [Telegram] Fetch xato (chat_id=${targetChatId}):`, errMsg);
            }
        }

        if (!success) {
            console.error('❌ [Telegram] Barcha chat_id larda xatolik yuz berdi:', errors);
            return NextResponse.json({ error: lastError, errors, success: false }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error('Telegram order error:', err);
        return NextResponse.json({ error: 'Server xatosi', success: false }, { status: 500 });
    }
}
