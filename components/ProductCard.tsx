'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import { Product } from '@/lib/types';
import { formatPrice, calcInstallment } from '@/lib/utils';
import { ShoppingCart, Heart, Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const { lang, addToCart, toggleFavorite, isFavorite, installmentPlans } = useStore();
    const router = useRouter();
    const t = lang === 'uz' ? uz : ru;
    const fav = isFavorite(product.id);

    // Aktiv bo'lib to'lash rejalarini olish
    const activePlans = installmentPlans.filter(p => p.isActive).sort((a, b) => a.months - b.months);
    // Eng arzon oylik to'lov (eng uzun muddat)
    const longestPlan = activePlans.length > 0 ? activePlans[activePlans.length - 1] : null;
    // Eng qisqa muddat (badge uchun)
    const shortestPlan = activePlans.length > 0 ? activePlans[0] : null;

    // Bo'lib to'lash narxini hisoblash: narx + foiz ustama
    const calcPlanMonthly = (price: number, months: number, interestPercent: number) => {
        const totalPrice = Math.ceil(price * (1 + interestPercent / 100));
        return Math.ceil(totalPrice / months);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 overflow-hidden flex flex-col group">
            {/* Image */}
            <Link href={`/product/${product.id}`} className="relative block bg-white p-3 aspect-square overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    loading="lazy"
                    unoptimized
                    className="object-contain group-hover:scale-105 transition-transform duration-300 p-2"
                    sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Installment badges - top left */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {shortestPlan && (
                        <span className="inline-flex items-center gap-0 bg-yellow-400 text-black text-[10px] font-extrabold rounded px-1.5 py-0.5 tracking-tight">
                            {shortestPlan.interestPercent === 0 ? '0' : shortestPlan.interestPercent}%-{shortestPlan.months}{lang === 'uz' ? 'oy' : 'м'}
                        </span>
                    )}
                    {longestPlan && longestPlan !== shortestPlan && (
                        <span className="inline-flex items-center gap-0 bg-blue-500 text-white text-[10px] font-extrabold rounded px-1.5 py-0.5 tracking-tight">
                            {longestPlan.interestPercent}%-{longestPlan.months}{lang === 'uz' ? 'oy' : 'м'}
                        </span>
                    )}
                </div>
                {/* New badge */}
                {product.isNew && (
                    <span className="absolute bottom-2 left-2 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {t.product.new}
                    </span>
                )}
                {/* Favorite */}
                <button
                    onClick={(e) => { e.preventDefault(); toggleFavorite(product.id); }}
                    className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${fav ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
                        }`}>
                    <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                </button>
            </Link>

            {/* Info */}
            <div className="px-3 pb-3 flex flex-col flex-1 gap-1">
                {/* Name */}
                <Link href={`/product/${product.id}`}>
                    <h3 className="text-xs text-gray-700 line-clamp-2 leading-snug hover:text-yellow-600 transition-colors min-h-[32px]">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] text-gray-400">{product.rating}</span>
                </div>

                {/* Price section */}
                <div className="mt-auto pt-1">
                    <p className="text-sm font-extrabold text-gray-900 leading-tight">{formatPrice(product.price)}</p>
                    {product.discountPercent && product.discountPercent > 0 && (
                        <p className="text-[10px] line-through text-gray-400">
                            {formatPrice(Math.ceil(product.price / (1 - product.discountPercent / 100)))}
                        </p>
                    )}
                    {/* Installment lines from global plans */}
                    {longestPlan && (
                        <p className="text-[10px] text-gray-500 mt-0.5">
                            💳 {longestPlan.months} {lang === 'uz' ? 'oy' : 'мес'}
                            {longestPlan.interestPercent > 0 && <span className="text-blue-500"> (+{longestPlan.interestPercent}%)</span>}
                            : <span className="font-semibold text-gray-700">
                                {formatPrice(calcPlanMonthly(product.price, longestPlan.months, longestPlan.interestPercent))}/{lang === 'uz' ? 'oy' : 'мес'}
                            </span>
                        </p>
                    )}
                </div>

                {/* Buttons */}
                <div className="mt-1.5 flex flex-col gap-1.5">
                    <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${product.inStock
                            ? 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
                            : 'border-gray-200 text-gray-300 cursor-not-allowed'
                            }`}>
                        <ShoppingCart size={11} />
                        <span>{lang === 'uz' ? 'Savatchaga' : 'В корзину'}</span>
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            useStore.getState().clearCart();
                            addToCart(product);
                            router.push('/cart?direct=1');
                        }}
                        disabled={!product.inStock}
                        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${product.inStock
                            ? 'bg-yellow-400 hover:bg-yellow-500 text-black'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}>
                        <span className="hidden sm:inline">{t.product.addToCart}</span>
                        <span className="sm:hidden">{lang === 'uz' ? 'Sotib olish' : 'Купить'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
