'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { X } from 'lucide-react';

export function MegaMenu() {
    const { megaMenuOpen, setMegaMenuOpen, lang, categories } = useStore();

    if (!megaMenuOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setMegaMenuOpen(false)} />
            <div className="absolute top-full left-0 right-0 z-50 bg-white shadow-xl border-t border-gray-100 animate-slideDown">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex justify-between items-center mb-5">
                        <h2 className="text-lg font-bold text-gray-900">{lang === 'uz' ? 'Kategoriyalar' : 'Категории'}</h2>
                        <button onClick={() => setMegaMenuOpen(false)} className="text-gray-400 hover:text-black p-1 rounded-lg hover:bg-gray-100 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                    <div className="grid grid-cols-5 lg:grid-cols-10 gap-3">
                        {categories.map(cat => (
                            <Link key={cat.id} href={`/catalog?category=${cat.slug}`}
                                onClick={() => setMegaMenuOpen(false)}
                                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-yellow-50 transition-all group text-center">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform">
                                    <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                        sizes="56px"
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-700 group-hover:text-yellow-700 leading-tight">
                                    {lang === 'uz' ? cat.name : cat.nameRu}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Promo strip */}
                    <div className="mt-5 bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-xl px-6 py-4 flex items-center justify-between">
                        <p className="font-bold text-black">
                            {lang === 'uz' ? "⚡ 0-0-12 muddatli to'lov — barcha mahsulotlarga!" : "⚡ Рассрочка 0-0-12 на все товары!"}
                        </p>
                        <Link href="/catalog" onClick={() => setMegaMenuOpen(false)}
                            className="bg-black text-yellow-400 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                            {lang === 'uz' ? "Xarid" : "Купить"}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
