'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart, Star, ArrowLeft, CheckCircle, XCircle, MessageSquare, Send } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { lang, addToCart, toggleFavorite, isFavorite, products, installmentPlans } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const product = products.find(p => p.id === Number(id));

    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const [reviewName, setReviewName] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <p className="text-5xl mb-4">😕</p>
                <p className="text-lg font-semibold mb-4">{lang === 'uz' ? "Mahsulot topilmadi" : "Товар не найден"}</p>
                <Link href="/" className="text-yellow-600 underline">{lang === 'uz' ? "Bosh sahifaga" : "На главную"}</Link>
            </div>
        </div>
    );

    const fav = isFavorite(product.id);
    const activePlans = installmentPlans.filter(p => p.isActive).sort((a, b) => a.months - b.months);

    // Tanlangan plan
    const selectedPlan = selectedPlanId
        ? activePlans.find(p => p.id === selectedPlanId)
        : activePlans.length > 0 ? activePlans[0] : null;

    // Bo'lib to'lash narxini hisoblash
    const calcPlanPrice = (price: number, interestPercent: number) => {
        return Math.ceil(price * (1 + interestPercent / 100));
    };

    const calcPlanMonthly = (price: number, months: number, interestPercent: number) => {
        return Math.ceil(calcPlanPrice(price, interestPercent) / months);
    };

    // Similar Products
    const similarProducts = products
        .filter(p => p.category === product.category && p.id !== product.id && p.inStock)
        .slice(0, 5);

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 pb-20">
            <Link href="/catalog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-5 transition-colors">
                <ArrowLeft size={16} /> {lang === 'uz' ? "Katalogga qaytish" : "Назад в каталог"}
            </Link>

            {/* PRODUCT MAIN INFO */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {/* Image */}
                <div className="relative bg-white rounded-2xl aspect-square overflow-hidden border border-gray-100 p-4">
                    <Image src={product.image} alt={product.name} fill className="object-contain p-4" priority unoptimized />
                    {product.isNew && (
                        <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                            {t.product.new}
                        </span>
                    )}
                    {product.discountPercent && (
                        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            -{product.discountPercent}%
                        </span>
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-5">
                    <div>
                        <span className="text-xs text-yellow-600 font-bold uppercase tracking-wider">{product.brand}</span>
                        <h1 className="text-2xl md:text-3xl font-extrabold mt-1 leading-tight text-gray-900">{product.name}</h1>
                        <div className="flex items-center gap-2 mt-2.5">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                                ))}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{product.rating} <span className="text-gray-400 font-normal">({product.reviewCount} sharh)</span></span>
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-2 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                        {product.inStock
                            ? <><CheckCircle size={14} className="text-green-500" /><span className="text-green-600 text-xs font-bold uppercase">{t.product.inStock}</span></>
                            : <><XCircle size={14} className="text-red-500" /><span className="text-red-500 text-xs font-bold uppercase">{t.product.outOfStock}</span></>}
                    </div>

                    {/* Prices */}
                    <div>
                        <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatPrice(product.price)}</p>
                        {product.discountPercent && product.discountPercent > 0 && (
                            <p className="text-gray-400 line-through text-sm mt-1">
                                {formatPrice(Math.ceil(product.price / (1 - product.discountPercent / 100)))}
                            </p>
                        )}
                    </div>

                    {/* ═══ BO'LIB TO'LASH REJALAR ═══ */}
                    {activePlans.length > 0 && (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-300 rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-extrabold px-3 py-1 rounded-bl-lg">
                                💳 {lang === 'uz' ? "Bo'lib to'lash" : "Рассрочка"}
                            </div>
                            <p className="text-sm font-bold text-gray-800 mb-3 mt-1">
                                {lang === 'uz' ? "Muddatni tanlang:" : "Выберите срок:"}
                            </p>

                            {/* Plan selection buttons */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {activePlans.map(plan => {
                                    const isSelected = selectedPlan?.id === plan.id;
                                    const monthly = calcPlanMonthly(product.price, plan.months, plan.interestPercent);
                                    return (
                                        <button
                                            key={plan.id}
                                            onClick={() => setSelectedPlanId(plan.id)}
                                            className={`flex flex-col items-center px-4 py-3 rounded-xl border-2 transition-all ${isSelected
                                                ? 'border-yellow-400 bg-yellow-400/20 shadow-sm scale-[1.02]'
                                                : 'border-gray-200 bg-white hover:border-yellow-300'
                                                }`}
                                        >
                                            <span className={`text-lg font-extrabold ${isSelected ? 'text-yellow-700' : 'text-gray-700'}`}>
                                                {plan.months}
                                            </span>
                                            <span className="text-[10px] text-gray-500 -mt-0.5">{lang === 'uz' ? 'oy' : 'мес'}</span>
                                            <span className={`text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${plan.interestPercent === 0
                                                ? 'bg-green-100 text-green-600'
                                                : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {plan.interestPercent === 0 ? '0%' : `+${plan.interestPercent}%`}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Selected plan details */}
                            {selectedPlan && (
                                <div className="bg-white rounded-xl p-4 border border-yellow-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">
                                            {lang === 'uz' ? 'Oylik to\'lov:' : 'Ежемесячный платеж:'}
                                        </span>
                                        <span className="text-2xl font-extrabold text-yellow-600">
                                            {formatPrice(calcPlanMonthly(product.price, selectedPlan.months, selectedPlan.interestPercent))}
                                            <span className="text-sm font-normal text-gray-400">/{lang === 'uz' ? 'oy' : 'мес'}</span>
                                        </span>
                                    </div>
                                    {selectedPlan.interestPercent > 0 && (
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">{lang === 'uz' ? 'Jami kredit narxi:' : 'Итого в кредит:'}</span>
                                            <span className="text-blue-600 font-bold">
                                                {formatPrice(calcPlanPrice(product.price, selectedPlan.interestPercent))}
                                                <span className="text-orange-500 ml-1">(+{selectedPlan.interestPercent}%)</span>
                                            </span>
                                        </div>
                                    )}
                                    {selectedPlan.interestPercent === 0 && (
                                        <p className="text-xs text-green-600 font-semibold">✅ {lang === 'uz' ? 'Foizsiz bo\'lib to\'lash!' : 'Без процентов!'}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                                <span className="text-xs text-gray-500 font-medium">{lang === 'uz' ? 'orqali:' : 'через:'}</span>
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFD600] font-black text-black text-sm shadow-sm">U</span>
                                <svg width="48" height="24" viewBox="0 0 44 20" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="44" height="20" rx="4" fill="#1565C0" />
                                    <text x="50%" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">CLICK</text>
                                </svg>
                                <svg width="54" height="24" viewBox="0 0 50 20" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="50" height="20" rx="4" fill="#00AAFF" />
                                    <text x="50%" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">Payme</text>
                                </svg>
                            </div>
                        </div>
                    )}

                    {/* Cart + Favorite */}
                    <div className="flex gap-3 mt-2">
                        <button
                            onClick={() => {
                                useStore.getState().clearCart();
                                addToCart(product);
                                router.push('/cart?direct=1');
                            }}
                            disabled={!product.inStock}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-base transition-all active:scale-95 ${product.inStock ? 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}>
                            <ShoppingCart size={20} />
                            {lang === 'uz' ? 'Hoziroq xarid qilish' : 'Купить сейчас'}
                        </button>
                        <button onClick={() => toggleFavorite(product.id)}
                            className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${fav ? 'bg-red-50 text-red-500 shadow-sm border border-red-100' : 'bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                                }`}>
                            <Heart size={22} fill={fav ? 'currentColor' : 'none'} />
                        </button>
                    </div>

                    {/* Specs */}
                    {product.specs && (
                        <div className="border border-gray-100 rounded-2xl overflow-hidden mt-4">
                            <div className="bg-gray-50 px-5 py-3 font-bold text-gray-800 border-b border-gray-100">
                                {lang === 'uz' ? "Xususiyatlar" : "Характеристики"}
                            </div>
                            {Object.entries(product.specs).map(([key, val], idx, arr) => (
                                <div key={key} className={`flex justify-between px-5 py-3 bg-white text-sm ${idx !== arr.length - 1 ? 'border-b border-gray-100' : ''}`}>
                                    <span className="text-gray-500">{key}</span>
                                    <span className="font-semibold text-gray-900 text-right">{val}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* SIMILAR PRODUCTS */}
            {similarProducts.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-extrabold text-gray-900">{lang === 'uz' ? 'Bunga o\'xshash mahsulotlar' : 'Похожие товары'}</h2>
                        <Link href={`/catalog?category=${product.category}`} className="text-yellow-600 font-semibold text-sm hover:underline">
                            {lang === 'uz' ? 'Barchasi' : 'Все'}
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {similarProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
