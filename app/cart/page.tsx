'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import {
    ShoppingCart, Trash2, Plus, Minus, ShoppingBag,
    ChevronRight, User, Phone, MapPin, Send, Loader2
} from 'lucide-react';

const ADMIN_CHAT_ID = '@ashinde_orders';

export default function CartPage() {
    const { cart, lang, removeFromCart, updateQuantity, cartTotal, clearCart, installmentPlans } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const total = cartTotal();

    const activePlans = installmentPlans.filter(p => p.isActive).sort((a, b) => a.months - b.months);

    const [step, setStep] = useState<'cart' | 'form' | 'success'>('cart');

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search.includes('direct=1')) {
            setStep('form');
        }
    }, []);
    const [sending, setSending] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [form, setForm] = useState({
        name: '',
        surname: '',
        phone: '',
        locationText: '',
        locationLat: '',
        locationLng: '',
    });

    // Tanlangan plan
    const selectedPlan = selectedPlanId
        ? activePlans.find(p => p.id === selectedPlanId)
        : activePlans.length > 0 ? activePlans[0] : null;

    // Kredit narxini hisoblash
    const calcCreditTotal = (interestPercent: number) => {
        return cart.reduce((sum, i) => {
            return sum + Math.ceil(i.product.price * (1 + interestPercent / 100)) * i.quantity;
        }, 0);
    };

    const creditTotal = selectedPlan ? calcCreditTotal(selectedPlan.interestPercent) : total;
    const monthlyPayment = selectedPlan ? Math.ceil(creditTotal / selectedPlan.months) : 0;

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert(lang === 'uz' ? 'Brauzeringiz lokatsiyani qo\'llamaydi' : 'Браузер не поддерживает геолокацию');
            return;
        }
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setForm(f => ({
                    ...f,
                    locationLat: pos.coords.latitude.toString(),
                    locationLng: pos.coords.longitude.toString(),
                    locationText: `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`,
                }));
                setLocationLoading(false);
            },
            () => {
                setLocationLoading(false);
                alert(lang === 'uz' ? 'Lokatsiya olishda xatolik yuz berdi' : 'Ошибка получения геолокации');
            },
            { timeout: 10000 }
        );
    };

    const handleOrder = async () => {
        if (!form.name.trim() || !form.phone.trim()) {
            alert(lang === 'uz' ? 'Ism va telefon raqamini kiriting!' : 'Введите имя и номер телефона!');
            return;
        }
        setSending(true);
        try {
            const items = cart.map(({ product, quantity }) => {
                const interestPercent = paymentMethod === 'credit' && selectedPlan ? selectedPlan.interestPercent : 0;
                const itemPrice = Math.ceil(product.price * (1 + interestPercent / 100));
                return {
                    name: product.name,
                    quantity,
                    price: itemPrice * quantity,
                    cashPrice: product.price * quantity,
                };
            });

            const orderTotal = paymentMethod === 'credit' ? creditTotal : total;
            const installmentMonths = paymentMethod === 'credit' && selectedPlan ? selectedPlan.months : 0;

            // Telegram ga yuborish
            let telegramSuccess = false;
            try {
                const telegramRes = await fetch('/api/telegram-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: form.name,
                        surname: form.surname,
                        phone: '+998' + form.phone,
                        location: {
                            lat: form.locationLat,
                            lng: form.locationLng,
                            text: form.locationText,
                        },
                        items,
                        total: orderTotal,
                        cashTotal: total,
                        creditTotal,
                        chatId: ADMIN_CHAT_ID,
                        paymentMethod,
                        installmentMonths,
                        interestPercent: selectedPlan?.interestPercent || 0,
                    }),
                });
                const telegramData = await telegramRes.json();
                telegramSuccess = telegramRes.ok && telegramData.success;
                if (!telegramSuccess) {
                    console.error('Telegram xabar yuborishda xato:', telegramData);
                }
            } catch (telegramErr) {
                console.error('Telegram API ga ulanishda xato:', telegramErr);
            }

            // Buyurtmani DATABASE ga saqlash
            const now = new Date();
            const dateStr = now.toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
            const productNames = cart.map(i => `${i.product.name} × ${i.quantity}`).join(', ');
            try {
                await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer: `${form.name} ${form.surname}`.trim(),
                        phone: '+998' + form.phone,
                        product: productNames,
                        amount: orderTotal,
                        status: 'new',
                        date: dateStr,
                        address: form.locationText || "Ko'rsatilmagan",
                        installment: installmentMonths,
                        paymentMethod,
                        telegramSent: telegramSuccess,
                    }),
                });
            } catch (dbErr) {
                console.error('Buyurtma saqlashda xato:', dbErr);
            }

            clearCart();
            setStep('success');
        } catch (err) {
            console.error('Buyurtma xatosi:', err);
            alert(lang === 'uz' ? 'Xatolik yuz berdi. Qaytadan urinib koʻring.' : 'Произошла ошибка. Попробуйте снова.');
        } finally {
            setSending(false);
        }
    };

    // ── SUCCESS ──
    if (step === 'success') {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center max-w-sm">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Send size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-extrabold mb-2 text-gray-900">
                        {lang === 'uz' ? 'Buyurtma qabul qilindi! 🎉' : 'Заказ принят! 🎉'}
                    </h2>
                    <p className="text-gray-500 mb-8 text-sm">
                        {lang === 'uz'
                            ? 'Operatorimiz siz bilan tez orada bog\'lanadi.'
                            : 'Наш оператор свяжется с вами в ближайшее время.'}
                    </p>
                    <Link href="/"
                        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-2xl transition-colors">
                        {lang === 'uz' ? 'Bosh sahifaga' : 'На главную'}
                    </Link>
                </div>
            </div>
        );
    }

    // ── EMPTY CART ──
    if (cart.length === 0 && step === 'cart') {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="text-center max-w-xs">
                    <ShoppingCart size={64} className="mx-auto text-gray-200 mb-4" />
                    <h2 className="text-xl font-bold mb-2">{t.cart.empty}</h2>
                    <p className="text-gray-500 text-sm mb-6">
                        {lang === 'uz' ? "Savatchangiz bo'sh. Xarid qiling!" : "Ваша корзина пуста. Добавьте товары!"}
                    </p>
                    <Link href="/catalog"
                        className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-2xl transition-colors">
                        <ShoppingBag size={18} />
                        {t.cart.continueShopping}
                    </Link>
                </div>
            </div>
        );
    }

    // ── ORDER FORM ──
    if (step === 'form') {
        return (
            <div className="max-w-lg mx-auto px-4 py-6">
                <button onClick={() => setStep('cart')}
                    className="flex items-center gap-2 text-gray-500 hover:text-black mb-5 text-sm transition-colors">
                    ← {lang === 'uz' ? 'Savatga qaytish' : 'Вернуться в корзину'}
                </button>

                <h1 className="text-xl font-extrabold mb-1">
                    {lang === 'uz' ? '📋 Buyurtma ma\'lumotlari' : '📋 Данные заказа'}
                </h1>
                <p className="text-gray-500 text-sm mb-6">
                    {lang === 'uz' ? 'Quyidagi ma\'lumotlarni to\'ldiring' : 'Заполните информацию ниже'}
                </p>

                <div className="space-y-4">
                    {/* Ism va Familiya */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <User size={15} className="text-yellow-500" />
                                {lang === 'uz' ? 'Ism *' : 'Имя *'}
                            </label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                placeholder={lang === 'uz' ? 'Masalan: Alisher' : 'Например: Иван'}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 focus:outline-none transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                                <User size={15} className="text-yellow-500" />
                                {lang === 'uz' ? 'Familiya' : 'Фамилия'}
                            </label>
                            <input
                                type="text"
                                value={form.surname}
                                onChange={e => setForm(f => ({ ...f, surname: e.target.value }))}
                                placeholder={lang === 'uz' ? 'Masalan: Karimov' : 'Например: Иванов'}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Telefon */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <Phone size={15} className="text-yellow-500" />
                            {lang === 'uz' ? 'Telefon raqam *' : 'Номер телефона *'}
                        </label>
                        <div className="flex shadow-sm">
                            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 font-bold text-sm">
                                +998
                            </span>
                            <input
                                type="tel"
                                value={form.phone}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 9);
                                    setForm(f => ({ ...f, phone: val }));
                                }}
                                placeholder="90 123 45 67"
                                className="flex-1 block w-full px-4 py-3 text-sm border border-gray-200 rounded-r-xl focus:border-yellow-400 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    {/* Lokatsiya */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                            <MapPin size={15} className="text-yellow-500" />
                            {lang === 'uz' ? 'Lokatsiya' : 'Местоположение'}
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={form.locationText}
                                onChange={e => setForm(f => ({ ...f, locationText: e.target.value, locationLat: '', locationLng: '' }))}
                                placeholder={lang === 'uz' ? 'Manzil yoki koordinatalar' : 'Адрес или координаты'}
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 focus:outline-none transition-colors"
                            />
                            <button
                                type="button"
                                onClick={handleGetLocation}
                                disabled={locationLoading}
                                className="flex-shrink-0 flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 text-black font-bold px-4 py-3 rounded-xl text-sm transition-colors">
                                {locationLoading
                                    ? <Loader2 size={16} className="animate-spin" />
                                    : <MapPin size={16} />}
                                {locationLoading ? '' : 'GPS'}
                            </button>
                        </div>
                        {form.locationLat && (
                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                ✓ {lang === 'uz' ? 'Lokatsiya aniqlandi' : 'Геолокация определена'}
                            </p>
                        )}
                    </div>

                    {/* To'lov usuli */}
                    <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <span className="text-yellow-500">💳</span>
                            {lang === 'uz' ? 'To\'lov usuli *' : 'Способ оплаты *'}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 font-bold text-sm transition-all ${paymentMethod === 'cash'
                                    ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                                    : 'border-gray-200 text-gray-500 hover:border-yellow-200'
                                    }`}
                            >
                                <span className="text-2xl">💵</span>
                                <span>{lang === 'uz' ? 'Naqt pul' : 'Наличными'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod('credit')}
                                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 font-bold text-sm transition-all ${paymentMethod === 'credit'
                                    ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                                    : 'border-gray-200 text-gray-500 hover:border-yellow-200'
                                    }`}
                            >
                                <span className="text-2xl">🏦</span>
                                <span>{lang === 'uz' ? 'Bo\'lib to\'lash' : 'Рассрочка'}</span>
                            </button>
                        </div>

                        {/* Bo'lib to'lash rejalarini tanlash */}
                        {paymentMethod === 'credit' && activePlans.length > 0 && (
                            <div className="mt-3 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                                <p className="text-xs font-semibold text-yellow-700 mb-3">
                                    {lang === 'uz' ? 'Muddatni tanlang:' : 'Выберите срок:'}
                                </p>
                                <div className="grid grid-cols-3 gap-2">
                                    {activePlans.map(plan => {
                                        const isSelected = selectedPlan?.id === plan.id;
                                        const planCreditTotal = calcCreditTotal(plan.interestPercent);
                                        const planMonthly = Math.ceil(planCreditTotal / plan.months);
                                        return (
                                            <button
                                                key={plan.id}
                                                type="button"
                                                onClick={() => setSelectedPlanId(plan.id)}
                                                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'border-yellow-400 bg-yellow-400/20 shadow-sm'
                                                    : 'border-gray-200 bg-white hover:border-yellow-300'
                                                    }`}
                                            >
                                                <span className={`text-base font-extrabold ${isSelected ? 'text-yellow-700' : 'text-gray-700'}`}>
                                                    {plan.months} {lang === 'uz' ? 'oy' : 'мес'}
                                                </span>
                                                <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${plan.interestPercent === 0
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {plan.interestPercent === 0 ? '0%' : `+${plan.interestPercent}%`}
                                                </span>
                                                <span className="text-[10px] text-gray-500 mt-1">
                                                    {formatPrice(planMonthly)}/{lang === 'uz' ? 'oy' : 'мес'}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {selectedPlan && (
                                    <div className="mt-3 bg-white rounded-lg p-3 border border-yellow-200">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">{lang === 'uz' ? 'Jami kredit narx:' : 'Итого в кредит:'}</span>
                                            <span className="font-bold text-blue-600">{formatPrice(creditTotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-gray-600">{lang === 'uz' ? 'Oylik to\'lov:' : 'Ежемесячно:'}</span>
                                            <span className="font-extrabold text-yellow-600">{formatPrice(monthlyPayment)}/{lang === 'uz' ? 'oy' : 'мес'}</span>
                                        </div>
                                        {selectedPlan.interestPercent > 0 && creditTotal > total && (
                                            <p className="text-[10px] text-orange-500 mt-1">
                                                ⚠️ {lang === 'uz'
                                                    ? `Naqd narxdan +${formatPrice(creditTotal - total)} qimmatroq (+${selectedPlan.interestPercent}%)`
                                                    : `Дороже наличной цены на +${formatPrice(creditTotal - total)} (+${selectedPlan.interestPercent}%)`}
                                            </p>
                                        )}
                                        {selectedPlan.interestPercent === 0 && (
                                            <p className="text-[10px] text-green-600 font-semibold mt-1">✅ {lang === 'uz' ? 'Foizsiz!' : 'Без процентов!'}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Order summary */}
                <div className="mt-6 bg-gray-50 rounded-xl p-4 space-y-2">
                    <p className="text-sm font-bold text-gray-800">
                        {lang === 'uz' ? 'Buyurtma:' : 'Заказ:'}
                    </p>
                    {cart.map(({ product, quantity }) => (
                        <div key={product.id} className="flex justify-between text-sm text-gray-600">
                            <span className="truncate mr-2">{product.name} × {quantity}</span>
                            <span className="font-semibold flex-shrink-0">{formatPrice(product.price * quantity)}</span>
                        </div>
                    ))}
                    <div className="border-t border-dashed pt-2 flex justify-between font-extrabold text-base">
                        <span>{lang === 'uz' ? 'Naqd narx' : 'Наличная цена'}</span>
                        <span className="text-yellow-600">{formatPrice(total)}</span>
                    </div>
                    {paymentMethod === 'credit' && selectedPlan && creditTotal > total && (
                        <div className="flex justify-between font-bold text-sm text-blue-600">
                            <span>{lang === 'uz' ? '🏦 Kredit narx' : '🏦 Цена в кредит'} (+{selectedPlan.interestPercent}%)</span>
                            <span>{formatPrice(creditTotal)}</span>
                        </div>
                    )}
                    {paymentMethod === 'credit' && selectedPlan && (
                        <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700 font-semibold">
                            💳 {selectedPlan.months} {lang === 'uz' ? 'oyga' : 'мес'}: {formatPrice(monthlyPayment)}/{lang === 'uz' ? 'oy' : 'мес'}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleOrder}
                    disabled={sending}
                    className="mt-5 w-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 disabled:opacity-60 text-black font-extrabold py-4 rounded-2xl text-base transition-all flex items-center justify-center gap-2">
                    {sending
                        ? <><Loader2 size={20} className="animate-spin" /> {lang === 'uz' ? 'Yuborilmoqda...' : 'Отправка...'}</>
                        : <><Send size={18} /> {lang === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}</>}
                </button>
            </div>
        );
    }

    // ── CART ──
    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-xl md:text-2xl font-extrabold mb-6 flex items-center gap-2">
                <ShoppingCart size={24} className="text-yellow-500" />
                {t.cart.title} ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </h1>

            <div className="grid md:grid-cols-5 gap-6">
                {/* Cart Items */}
                <div className="md:col-span-3 space-y-3">
                    {cart.map(({ product, quantity }) => (
                        <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
                            <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                                <Image src={product.image} alt={product.name} fill unoptimized className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-yellow-600 font-semibold">{product.brand}</p>
                                <h3 className="text-sm font-semibold line-clamp-2">{product.name}</h3>
                                <p className="text-base font-extrabold mt-1">{formatPrice(product.price)}</p>
                                {activePlans.length > 0 && (
                                    <p className="text-[10px] text-gray-500">
                                        {lang === 'uz' ? 'dan: ' : 'от: '}
                                        {formatPrice(Math.ceil(product.price * (1 + (activePlans[0]?.interestPercent || 0) / 100) / (activePlans[activePlans.length - 1]?.months || 12)))}/{lang === 'uz' ? 'oy' : 'мес'}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                <button onClick={() => removeFromCart(product.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(product.id, quantity - 1)}
                                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-yellow-100 flex items-center justify-center transition-colors">
                                        <Minus size={12} />
                                    </button>
                                    <span className="text-sm font-bold min-w-[24px] text-center">{quantity}</span>
                                    <button onClick={() => updateQuantity(product.id, quantity + 1)}
                                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-yellow-100 flex items-center justify-center transition-colors">
                                        <Plus size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="md:col-span-2">
                    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm sticky top-24 space-y-5">
                        <h2 className="font-bold text-base">{lang === 'uz' ? 'Buyurtma xulosasi' : 'Сводка заказа'}</h2>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">{lang === 'uz' ? 'Mahsulotlar' : 'Товары'}</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">{lang === 'uz' ? 'Yetkazib berish' : 'Доставка'}</span>
                                <span className="text-green-600 font-medium">{lang === 'uz' ? 'Bepul' : 'Бесплатно'}</span>
                            </div>
                            <div className="border-t border-dashed pt-2 flex justify-between font-extrabold text-base">
                                <span>{t.cart.total}</span>
                                <span className="text-yellow-600">{formatPrice(total)}</span>
                            </div>
                            {activePlans.length > 0 && (
                                <div className="bg-yellow-50 rounded-xl px-3 py-2 text-xs text-gray-600 space-y-1">
                                    <p className="font-semibold text-yellow-700 mb-1">{lang === 'uz' ? "💳 Bo'lib to'lash:" : '💳 Рассрочка:'}</p>
                                    {activePlans.slice(0, 3).map(plan => {
                                        const planTotal = calcCreditTotal(plan.interestPercent);
                                        const planMonthly = Math.ceil(planTotal / plan.months);
                                        return (
                                            <div key={plan.id} className="flex justify-between">
                                                <span>{plan.months} {lang === 'uz' ? 'oy' : 'мес'} {plan.interestPercent > 0 ? `(+${plan.interestPercent}%)` : '(0%)'}</span>
                                                <span className="font-bold">{formatPrice(planMonthly)}/{lang === 'uz' ? 'oy' : 'мес'}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setStep('form')}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-black font-extrabold py-4 rounded-2xl text-base transition-all flex items-center justify-center gap-2">
                            {lang === 'uz' ? 'Buyurtma berish' : 'Оформить заказ'}
                            <ChevronRight size={18} />
                        </button>
                        <p className="text-[10px] text-gray-400 text-center">{t.cart.installmentNote}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
