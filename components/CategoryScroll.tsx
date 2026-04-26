'use client';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { useSearchParams } from 'next/navigation';

export function CategoryScroll() {
    const { lang, categories } = useStore();
    const searchParams = useSearchParams();
    const activeCategory = searchParams.get('category');

    return (
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
            {/* All */}
            <Link href="/catalog"
                className={`flex-shrink-0 flex flex-col items-center gap-2 px-3 py-3 rounded-2xl transition-all min-w-[96px] border ${!activeCategory ? 'bg-yellow-50 border-yellow-300' : 'border-transparent hover:bg-gray-50'}`}>
                <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
                    <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=200&q=80"
                        alt="Barchasi" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-semibold text-center text-gray-800 leading-tight w-[96px] text-center truncate">
                    {lang === 'uz' ? 'Barchasi' : 'Всё'}
                </span>
            </Link>

            {categories.map(cat => (
                <Link key={cat.id} href={`/catalog?category=${cat.slug}`}
                    className={`flex-shrink-0 flex flex-col items-center gap-2 px-3 py-3 rounded-2xl transition-all min-w-[96px] border ${activeCategory === cat.slug ? 'bg-yellow-50 border-yellow-300' : 'border-transparent hover:bg-gray-50'}`}>
                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm">
                        <img
                            src={cat.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80'}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                            onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&q=80'; }}
                        />
                    </div>
                    <span className="text-xs font-semibold text-center text-gray-800 leading-tight w-[96px] line-clamp-2 text-center">
                        {lang === 'uz' ? cat.name : cat.nameRu}
                    </span>
                </Link>
            ))}
        </div>
    );
}
