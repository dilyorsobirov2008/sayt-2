'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
    const { lang, favorites, toggleFavorite, addToCart, products } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const favProducts = products.filter(p => favorites.includes(p.id));

    return (
        <div className="max-w-5xl mx-auto px-4 py-6">
            <h1 className="text-xl md:text-2xl font-extrabold mb-6 flex items-center gap-2">
                <Heart size={22} className="text-red-500 fill-red-500" />
                {t.favorites.title} ({favProducts.length})
            </h1>

            {favProducts.length === 0 ? (
                <div className="min-h-[50vh] flex items-center justify-center">
                    <div className="text-center max-w-xs">
                        <Heart size={64} className="mx-auto text-gray-200 mb-4" />
                        <h2 className="text-lg font-bold mb-2">{t.favorites.empty}</h2>
                        <Link href="/catalog"
                            className="inline-block mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl transition-colors text-sm">
                            {lang === 'uz' ? "Katalogga o'tish" : "Перейти в каталог"}
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {favProducts.map(p => (
                        <div key={p.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <Link href={`/product/${p.id}`} className="block relative bg-gray-50 aspect-square">
                                <Image src={p.image} alt={p.name} fill unoptimized className="object-cover" loading="lazy" />
                            </Link>
                            <div className="p-3">
                                <p className="text-[10px] text-yellow-600 font-semibold">{p.brand}</p>
                                <p className="text-xs font-semibold line-clamp-2 mb-2">{p.name}</p>
                                <p className="text-sm font-bold">{formatPrice(p.price)}</p>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => addToCart(p)}
                                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                        <ShoppingCart size={12} />
                                        {lang === 'uz' ? 'Savat' : 'Корзина'}
                                    </button>
                                    <button onClick={() => toggleFavorite(p.id)}
                                        className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors text-red-500">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
