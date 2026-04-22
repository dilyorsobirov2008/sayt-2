import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8516821604:AAEW4IT9CXtB6R9hcoeRcnsJygCVzQ-IhOo';
const CHANNEL_ID = process.env.TELEGRAM_REVIEW_CHANNEL_ID || '-1005025823520'; // -100 kanal uchun kerak
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

export async function GET() {
  // Sharhlar endi DB da saqlanmaydi
  return NextResponse.json({ reviews: [] });
}

export async function POST(req: NextRequest) {
  try {
    const { productId, productName, userName, rating, comment } = await req.json();

    if (!rating) {
      return NextResponse.json({ error: "Baholash kerak" }, { status: 400 });
    }

    const ratingNum = Math.max(1, Math.min(5, parseInt(rating)));
    const stars = '⭐'.repeat(ratingNum);
    const emptyStars = '☆'.repeat(5 - ratingNum);

    const message = `💬 <b>YANGI SHARH!</b>

🛍 <b>Mahsulot:</b> ${productName || `#${productId}`}
👤 <b>Foydalanuvchi:</b> ${userName || 'Anonim'}
${stars}${emptyStars} <b>(${ratingNum}/5)</b>

📝 <i>${comment || '—'}</i>

⏰ ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`;

    const tgRes = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHANNEL_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      console.error('Telegram channel error:', tgData);
      return NextResponse.json({ error: tgData.description || 'TG xatosi' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Review error:', error);
    return NextResponse.json({ error: error.message || 'Xatolik yuz berdi' }, { status: 500 });
  }
}
