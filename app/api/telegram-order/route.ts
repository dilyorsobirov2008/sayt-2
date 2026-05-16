import { NextRequest, NextResponse } from 'next/server';
import type {
  TelegramOrderRequest,
  TelegramOrderResponse,
  TelegramApiResponse,
  TelegramInlineButton,
  OrderItem,
} from '@/lib/types';

export const dynamic = 'force-dynamic';

// ─── Config ───────────────────────────────────────────────────────────────────

const BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ?? '8516821604:AAEW4IT9CXtB6R9hcoeRcnsJygCVzQ-IhOo';
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildItemsList(items: OrderItem[]): string {
  return items
    .map(
      (item, i) =>
        `  ${i + 1}. ${item.name} × ${item.quantity} — ${item.price.toLocaleString()} so'm`
    )
    .join('\n');
}

function buildLocationText(location: TelegramOrderRequest['location']): string {
  const hasCoords = Boolean(location.lat && location.lng);
  if (hasCoords) {
    return `📍 <a href="https://www.google.com/maps?q=${location.lat},${location.lng}">Lokatsiyani ko'rish</a>`;
  }
  if (location.text) return `📍 ${location.text}`;
  return "📍 Ko'rsatilmagan";
}

function buildMapLink(location: TelegramOrderRequest['location']): string {
  const hasCoords = Boolean(location.lat && location.lng);
  if (hasCoords) return `https://www.google.com/maps?q=${location.lat},${location.lng}`;
  if (location.text) {
    return `https://www.google.com/maps/search/${encodeURIComponent(location.text)}`;
  }
  return '';
}

function buildMessage(params: {
  body: TelegramOrderRequest;
  locationText: string;
  itemsList: string;
  paymentMethodText: string;
  creditInfo: string;
}): string {
  const { body, locationText, itemsList, paymentMethodText, creditInfo } = params;
  const timestamp = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });

  return `🛒 <b>YANGI BUYURTMA!</b>

👤 <b>Ism:</b> ${body.name} ${body.surname ?? ''}
📞 <b>Telefon:</b> ${body.phone}
📍 <b>Manzil:</b> ${locationText}

🛍 <b>Buyurtma mahsulotlari:</b>
${itemsList}

💰 <b>Umumiy narx:</b> ${body.total.toLocaleString()} so'm
💳 <b>To'lov usuli:</b> ${paymentMethodText}
${creditInfo}

⏰ ${timestamp}`;
}

async function sendTelegramMessage(
  chatId: string,
  message: string,
  inlineKeyboard: TelegramInlineButton[][]
): Promise<TelegramApiResponse> {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
      disable_web_page_preview: false,
      reply_markup:
        inlineKeyboard.length > 0 ? { inline_keyboard: inlineKeyboard } : undefined,
    }),
  });

  return res.json() as Promise<TelegramApiResponse>;
}

// ─── POST /api/telegram-order ─────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse<TelegramOrderResponse>> {
  try {
    const body: TelegramOrderRequest = await req.json();
    const {
      location,
      items,
      total,
      cashTotal,
      creditTotal,
      paymentMethod,
      installmentMonths,
      interestPercent,
    } = body;

    const itemsList    = buildItemsList(items);
    const locationText = buildLocationText(location);
    const mapLink      = buildMapLink(location);

    const paymentMethodText =
      paymentMethod === 'credit'
        ? `🏦 <b>Bo'lib to'lash (${installmentMonths} oyga, +${interestPercent ?? 0}%)</b>`
        : `💵 <b>Naqd pul</b>`;

    const creditInfo =
      paymentMethod === 'credit' && cashTotal && creditTotal
        ? `\n💵 <b>Naqd narx:</b> ${cashTotal.toLocaleString()} so'm\n` +
          `🏦 <b>Kredit narx:</b> ${creditTotal.toLocaleString()} so'm (+${interestPercent ?? 0}% ustama)\n` +
          `📊 <b>Oylik to'lov:</b> ${Math.ceil(creditTotal / installmentMonths).toLocaleString()} so'm × ${installmentMonths} oy`
        : '';

    const message = buildMessage({
      body,
      locationText,
      itemsList,
      paymentMethodText,
      creditInfo,
    });

    const inlineKeyboard: TelegramInlineButton[][] = mapLink
      ? [[{ text: '🚚 Yetkazib berish', url: mapLink }]]
      : [];

    // Chat ID lar
    const personalChatId = process.env.TELEGRAM_CHAT_ID ?? '7351189083';
    const groupChatId    = process.env.TELEGRAM_GROUP_ID ?? '-1003854963252';
    const chatIds        = [personalChatId, groupChatId].filter(Boolean);

    let sent       = false;
    let lastError  = '';
    const errors: string[] = [];

    for (const chatId of chatIds) {
      try {
        console.log(`📡 [Telegram] Yuborilmoqda: chat_id=${chatId}`);
        const data = await sendTelegramMessage(chatId, message, inlineKeyboard);
        console.log(`📡 [Telegram] Javob (${chatId}):`, JSON.stringify(data));

        if (data.ok) {
          sent = true;
          console.log(`✅ [Telegram] Muvaffaqiyatli: chat_id=${chatId}`);
          break;
        }

        lastError = data.description ?? 'Noma\'lum xato';
        errors.push(`chat_id=${chatId}: ${lastError}`);
        console.error(`❌ [Telegram] Xato (${chatId}):`, lastError);

        if (data.error_code === 400 && chatId.startsWith('-100')) {
          console.warn(
            `💡 Chat ID ${chatId} — bot guruhda admin emas yoki ID noto'g'ri.`
          );
        }
      } catch (fetchErr) {
        const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
        errors.push(`chat_id=${chatId}: fetch xato — ${msg}`);
        console.error(`❌ [Telegram] Fetch xato (${chatId}):`, msg);
      }
    }

    if (!sent) {
      console.error('❌ [Telegram] Barcha chat_id larda xatolik:', errors);
      return NextResponse.json({ success: false, error: lastError, errors }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server xatosi';
    console.error('[POST /api/telegram-order]', e);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
