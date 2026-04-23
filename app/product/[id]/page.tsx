'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { ShoppingCart, Heart, Star, ArrowLeft, CheckCircle, XCircle, Send, ChevronLeft, ChevronRight, LogIn } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

interface Variant { id: number; color: string; colorName: string; colorNameRu: string | null; image: string | null; }
interface Review { id: number; userName: string; rating: number; comment: string; createdAt: string; }

export default function ProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { lang, addToCart, toggleFavorite, isFavorite, products, installmentPlans } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const product = products.find(p => p.id === Number(id));

    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

    // Gallery
    const [images, setImages] = useState<string[]>([]);
    const [activeImg, setActiveImg] = useState(0);

    // Variants
    const [variants, setVariants] = useState<Variant[]>([]);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

    // Reviews
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Auth
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        setIsLoggedIn(localStorage.getItem('user_auth') === 'true' || localStorage.getItem('admin_auth') === 'true');
        setUserId(localStorage.getItem('user_id'));
        setUserName(localStorage.getItem('user_name') || '');
    }, []);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/products/${id}`)
            .then(r => r.json())
            .then(data => {
                if (data.product) {
                    const imgs = data.product.images?.length ? data.product.images : [data.product.image];
                    setImages(imgs);
                    setVariants(data.product.variants || []);
                }
            }).catch(() => {});

        setReviewsLoading(true);
        fetch(`/api/reviews?productId=${id}`)
            .then(r => r.json())
            .then(data => { setReviews(data.reviews || []); setReviewsLoading(false); })
            .catch(() => setReviewsLoading(false));
    }, [id]);

    useEffect(() => {
        if (product && images.length === 0) {
            setImages((product as any).images?.length ? (product as any).images : [product.image]);
        }
    }, [product]);

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
    const selectedPlan = selectedPlanId ? activePlans.find(p => p.id === selectedPlanId) : activePlans[0] ?? null;
    const calcPlanPrice = (price: number, pct: number) => Math.ceil(price * (1 + pct / 100));
    const calcMonthly = (price: number, months: number, pct: number) => Math.ceil(calcPlanPrice(price, pct) / months);
    const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id && p.inStock).slice(0, 5);
    const currentImage = selectedVariant?.image || images[activeImg] || product.image;

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: product.id,
                    productName: product.name,
                    userId,
                    userName: userName || (lang === 'uz' ? 'Anonim' : 'Аноним'),
                    rating: reviewRating,
                    comment: reviewText,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setReviewText('');
                setReviewRating(5);
                setSubmitSuccess(true);
                // add the new review to the local state so it appears immediately!
                setReviews([data.review, ...reviews]);
                setTimeout(() => setSubmitSuccess(false), 4000);
            } else {
                alert("Xatolik: " + data.error);
            }
        } catch (err: any) { 
            console.error(err); 
            alert('Tarmoq xatosi: ' + err?.message);
        }
        setSubmitting(false);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 pb-20">
            <Link href="/catalog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-5 transition-colors">
                <ArrowLeft size={16} /> {lang === 'uz' ? "Katalogga qaytish" : "Назад в каталог"}
            </Link>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {/* ═══ IMAGE GALLERY ═══ */}
                <div>
                    <div className="relative bg-white rounded-2xl aspect-square overflow-hidden border border-gray-100 p-4 mb-3">
                        <Image src={currentImage} alt={product.name} fill className="object-contain p-4" priority unoptimized />
                        {product.isNew && (
                            <span className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">{t.product.new}</span>
                        )}
                        {product.discountPercent && (
                            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">-{product.discountPercent}%</span>
                        )}
                        {images.length > 1 && !selectedVariant && (
                            <>
                                <button onClick={() => setActiveImg(prev => (prev - 1 + images.length) % images.length)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={() => setActiveImg(prev => (prev + 1) % images.length)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                                    <ChevronRight size={16} />
                                </button>
                            </>
                        )}
                    </div>
                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex gap-2 flex-wrap">
                            {images.map((img, idx) => (
                                <button key={idx} onClick={() => { setActiveImg(idx); setSelectedVariant(null); }}
                                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === idx && !selectedVariant ? 'border-yellow-400' : 'border-gray-200 hover:border-yellow-300'}`}>
                                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-contain p-1" unoptimized />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                    {/* ═══ INFO ═══ */}
                    <div className="flex flex-col gap-5">
                        <div>
                            <span className="text-xs text-yellow-600 font-bold uppercase tracking-wider">{product.brand}</span>
                            <h1 className="text-2xl md:text-3xl font-extrabold mt-1 leading-tight text-gray-900">{product.name}</h1>
                            <div className="flex items-center gap-2 mt-2.5">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => {
                                        const actualRating = reviews.length > 0 
                                            ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
                                            : product.rating;
                                        return (
                                            <Star key={i} size={16} className={i < Math.floor(actualRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                                        )
                                    })}
                                </div>
                                <span className="text-sm font-semibold text-gray-700">
                                    {(reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) : product.rating).toFixed(1)} 
                                    <span className="text-gray-400 font-normal ml-1">
                                        ({reviews.length > 0 ? reviews.length : (product.reviewCount || 0)} sharh)
                                    </span>
                                </span>
                            </div>
                        </div>

                    <div className="flex items-center gap-2 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100">
                        {product.inStock
                            ? <><CheckCircle size={14} className="text-green-500" /><span className="text-green-600 text-xs font-bold uppercase">{t.product.inStock}</span></>
                            : <><XCircle size={14} className="text-red-500" /><span className="text-red-500 text-xs font-bold uppercase">{t.product.outOfStock}</span></>}
                    </div>

                    <div>
                        <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatPrice(product.price)}</p>
                        {product.discountPercent && product.discountPercent > 0 && (
                            <p className="text-gray-400 line-through text-sm mt-1">{formatPrice(Math.ceil(product.price / (1 - product.discountPercent / 100)))}</p>
                        )}
                    </div>

                    {/* ═══ VARIANTS ═══ */}
                    {variants.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm font-bold text-gray-800 mb-3">
                                {lang === 'uz' ? 'Variant tanlang:' : 'Выберите вариант:'}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                {variants.map((v: Variant) => {
                                    const isSelected = selectedVariant?.id === v.id;
                                    const variantName = lang === 'uz' ? v.colorName : (v.colorNameRu || v.colorName);
                                    return (
                                        <button key={v.id}
                                            onClick={() => setSelectedVariant(isSelected ? null : v)}
                                            className={`px-4 py-2 rounded-xl border-2 font-semibold text-sm transition-all ${isSelected ? 'border-yellow-400 bg-yellow-50 text-yellow-800 shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'}`}>
                                            {variantName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* ═══ INSTALLMENT PLANS ═══ */}
                    {activePlans.length > 0 && (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-300 rounded-2xl p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[10px] font-extrabold px-3 py-1 rounded-bl-lg">
                                💳 {lang === 'uz' ? "Bo'lib to'lash" : "Рассрочка"}
                            </div>
                            <p className="text-sm font-bold text-gray-800 mb-3 mt-1">{lang === 'uz' ? "Muddatni tanlang:" : "Выберите срок:"}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {activePlans.map(plan => {
                                    const isSel = selectedPlan?.id === plan.id;
                                    return (
                                        <button key={plan.id} onClick={() => setSelectedPlanId(plan.id)}
                                            className={`flex flex-col items-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl border-2 transition-all ${isSel ? 'border-yellow-400 bg-yellow-400/20 shadow-sm scale-[1.02]' : 'border-gray-200 bg-white hover:border-yellow-300'}`}>
                                            <span className={`text-base sm:text-lg font-extrabold ${isSel ? 'text-yellow-700' : 'text-gray-700'}`}>{plan.months}</span>
                                            <span className="text-[9px] sm:text-[10px] text-gray-500 -mt-0.5">{lang === 'uz' ? 'oy' : 'мес'}</span>
                                            <span className={`text-[9px] sm:text-[10px] font-bold mt-1 px-1.5 py-0.5 rounded ${plan.interestPercent === 0 ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {plan.interestPercent === 0 ? '0%' : `+${plan.interestPercent}%`}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedPlan && (
                                <div className="bg-white rounded-xl p-4 border border-yellow-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600">{lang === 'uz' ? "Oylik to'lov:" : 'Ежемесячный платеж:'}</span>
                                        <span className="text-2xl font-extrabold text-yellow-600">{formatPrice(calcMonthly(product.price, selectedPlan.months, selectedPlan.interestPercent))}<span className="text-sm font-normal text-gray-400">/{lang === 'uz' ? 'oy' : 'мес'}</span></span>
                                    </div>
                                    {selectedPlan.interestPercent > 0 && (
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500">{lang === 'uz' ? 'Jami kredit narxi:' : 'Итого в кредит:'}</span>
                                            <span className="text-blue-600 font-bold">{formatPrice(calcPlanPrice(product.price, selectedPlan.interestPercent))}<span className="text-orange-500 ml-1">(+{selectedPlan.interestPercent}%)</span></span>
                                        </div>
                                    )}
                                    {selectedPlan.interestPercent === 0 && <p className="text-xs text-green-600 font-semibold">✅ {lang === 'uz' ? "Foizsiz bo'lib to'lash!" : 'Без процентов!'}</p>}
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-3 flex-wrap">
                                <span className="text-xs text-gray-500 font-medium">{lang === 'uz' ? 'orqali:' : 'через:'}</span>
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#FFD600] font-black text-black text-sm shadow-sm">U</span>
                                <svg width="48" height="24" viewBox="0 0 44 20"><rect width="44" height="20" rx="4" fill="#1565C0" /><text x="50%" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">CLICK</text></svg>
                                <svg width="54" height="24" viewBox="0 0 50 20"><rect width="50" height="20" rx="4" fill="#00AAFF" /><text x="50%" y="14" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">Payme</text></svg>
                            </div>
                        </div>
                    )}

                    {/* Cart + Fav */}
                    <div className="flex gap-3 mt-2">
                        <button onClick={() => { 
                            if (typeof window !== 'undefined') {
                                const isAuth = localStorage.getItem('user_auth') === 'true' || localStorage.getItem('admin_auth') === 'true';
                                if (!isAuth) {
                                    router.push(`/login?returnUrl=/product/${product.id}`);
                                    return;
                                }
                            }
                            useStore.getState().clearCart(); 
                            addToCart(product); 
                            router.push('/cart?direct=1'); 
                        }}
                            disabled={!product.inStock}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-extrabold text-base transition-all active:scale-95 ${product.inStock ? 'bg-yellow-400 hover:bg-yellow-500 text-black shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                            <ShoppingCart size={20} />{lang === 'uz' ? 'Hoziroq xarid qilish' : 'Купить сейчас'}
                        </button>
                        <button onClick={() => toggleFavorite(product.id)}
                            className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center transition-all ${fav ? 'bg-red-50 text-red-500 shadow-sm border border-red-100' : 'bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}>
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
                                    <span className="font-semibold text-gray-900 text-right">{val as string}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ REVIEWS ═══ */}
            <div className="mb-16">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                    {lang === 'uz' ? 'Sharh qoldiring' : 'Оставить отзыв'}
                </h2>

                {submitSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                        <p className="text-4xl mb-3">✅</p>
                        <p className="font-bold text-green-700 text-lg">
                            {lang === 'uz' ? 'Sharhingiz yuborildi!' : 'Ваш отзыв отправлен!'}
                        </p>
                        <p className="text-sm text-green-600 mt-1">
                            {lang === 'uz' ? 'Rahmat! Fikringiz qabul qilindi.' : 'Спасибо! Ваше мнение принято.'}
                        </p>
                    </div>
                ) : !isLoggedIn ? (
                    <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                        <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            {lang === 'uz' ? 'Sharh qoldirish uchun tizimga kiring' : 'Войдите, чтобы оставить отзыв'}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                            {lang === 'uz' 
                                ? 'Faqat ro\'yxatdan o\'tgan foydalanuvchilar o\'z fikrlarini yozib qoldirishlari mumkin.' 
                                : 'Оставлять отзывы могут только зарегистрированные пользователи.'}
                        </p>
                        <Link href={`/login?returnUrl=/product/${product.id}`}
                            className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-xl transition-all active:scale-95">
                            <LogIn size={18} />
                            {lang === 'uz' ? 'Tizimga kirish' : 'Войти'}
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">{lang === 'uz' ? 'Baholang:' : 'Оценка:'}</p>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button key={star} type="button"
                                            onClick={() => setReviewRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110">
                                            <Star size={32} className={star <= (hoverRating || reviewRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                                placeholder={lang === 'uz' ? 'Fikringizni yozing...' : 'Напишите ваш отзыв...'}
                                rows={3}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-yellow-400 transition-colors resize-none bg-gray-50 focus:bg-white" />
                            <button type="submit" disabled={submitting}
                                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-100 disabled:text-gray-400 text-black font-bold px-6 py-3 rounded-xl transition-all active:scale-95">
                                <Send size={16} />
                                {submitting ? (lang === 'uz' ? 'Yuborilmoqda...' : 'Отправка...') : (lang === 'uz' ? 'Yuborish' : 'Отправить')}
                            </button>
                        </form>
                    </div>
                )}

                {/* REVIEWS LIST */}
                <div className="mt-8 space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                        {lang === 'uz' ? 'Barcha sharhlar' : 'Все отзывы'} <span className="text-gray-400 text-base font-normal ml-2">({reviews.length})</span>
                    </h3>
                    
                    {reviewsLoading ? (
                        <div className="text-center text-gray-400 py-8 text-sm">...</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center text-gray-500 py-10 bg-gray-50 border border-gray-100 rounded-2xl">
                            {lang === 'uz' ? 'Hali sharhlar yo\'q. Birinchi bo\'lib sharh qoldiring!' : 'Пока нет отзывов. Оставьте первый отзыв!'}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-gray-900">{review.userName}</p>
                                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400' : 'text-gray-200 fill-gray-200'} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-3">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Similar */}
            {similarProducts.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-extrabold text-gray-900">{lang === 'uz' ? "Bunga o'xshash mahsulotlar" : 'Похожие товары'}</h2>
                        <Link href={`/catalog?category=${product.category}`} className="text-yellow-600 font-semibold text-sm hover:underline">{lang === 'uz' ? 'Barchasi' : 'Все'}</Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                        {similarProducts.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
