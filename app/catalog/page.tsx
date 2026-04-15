'use client';
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/ProductCard';
import { CategoryScroll } from '@/components/CategoryScroll';
import { useStore } from '@/lib/store';
import { Product } from '@/lib/types';
import Link from 'next/link';
import { SlidersHorizontal, X } from 'lucide-react';

export default function CatalogPage() {
    return (
        <Suspense>
            <CatalogContent />
        </Suspense>
    );
}

function CatalogContent() {
    const { lang, searchQuery, products, categories } = useStore();
    const searchParams = useSearchParams();
    
    // URL Params
    const activeCategory = searchParams.get('category') || '';
    const searchStr = searchParams.get('search') || searchQuery || '';
    const featured = searchParams.get('featured');
    const sort = searchParams.get('sort') || '';

    // Filter States
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Filter Logic
    const availableBrands = useMemo(() => {
        let list = products;
        if (activeCategory) list = list.filter(p => p.category === activeCategory);
        if (searchStr) list = list.filter(p => 
            p.name.toLowerCase().includes(searchStr.toLowerCase()) || 
            (p.nameRu || '').toLowerCase().includes(searchStr.toLowerCase())
        );
        const brands = new Set(list.map(p => p.brand).filter(Boolean));
        return Array.from(brands);
    }, [products, activeCategory, searchStr]);

    // Reset filters when changing category/search
    useEffect(() => {
        setMinPrice('');
        setMaxPrice('');
        setSelectedBrands([]);
    }, [activeCategory, searchStr]);

    const filtered = useMemo(() => {
        let result = [...products];
        if (activeCategory) result = result.filter(p => p.category === activeCategory);
        if (searchStr) result = result.filter(p =>
            p.name.toLowerCase().includes(searchStr.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchStr.toLowerCase()) ||
            (p.nameRu || '').toLowerCase().includes(searchStr.toLowerCase())
        );
        if (featured === 'true') result = result.filter(p => p.isFeatured);
        
        // Apply Smart Filters
        if (selectedBrands.length > 0) {
            result = result.filter(p => selectedBrands.includes(p.brand));
        }
        if (minPrice) {
            result = result.filter(p => p.price >= parseInt(minPrice.replace(/\D/g, '')));
        }
        if (maxPrice) {
            result = result.filter(p => p.price <= parseInt(maxPrice.replace(/\D/g, '')));
        }

        if (sort === 'price_asc') result.sort((a, b) => a.price - b.price);
        else if (sort === 'price_desc') result.sort((a, b) => b.price - a.price);
        else if (sort === 'new') result = result.filter(p => p.isNew).concat(result.filter(p => !p.isNew));
        
        return result;
    }, [activeCategory, searchStr, featured, sort, products, minPrice, maxPrice, selectedBrands]);

    const activeCat = categories.find(c => c.slug === activeCategory);
    const title = activeCat
        ? (lang === 'uz' ? activeCat.name : activeCat.nameRu)
        : searchStr
            ? `"${searchStr}" — qidiruv natijalari`
            : (lang === 'uz' ? 'Barcha mahsulotlar' : 'Все товары');

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4">
            {/* Categories */}
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
                <Suspense><CategoryScroll /></Suspense>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                
                {/* Mobile Filter Toggle */}
                <button 
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-xl font-bold text-sm"
                >
                    <SlidersHorizontal size={16} /> 
                    {lang === 'uz' ? 'Filtrlar' : 'Фильтры'}
                </button>

                {/* Sidebar Filter */}
                <aside className={`w-full lg:w-64 flex-shrink-0 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-all ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
                    <div className="flex items-center justify-between mb-4 lg:hidden">
                        <h3 className="font-bold">{lang === 'uz' ? 'Filtrlar' : 'Фильтры'}</h3>
                        <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 bg-gray-100 rounded-lg"><X size={16}/></button>
                    </div>

                    <h3 className="font-extrabold text-sm mb-3 text-gray-800 uppercase tracking-wide">
                        {lang === 'uz' ? 'Narx' : 'Цена'}
                    </h3>
                    <div className="flex items-center gap-2 mb-6">
                        <input 
                            type="number" 
                            placeholder={lang === 'uz' ? 'Dan' : 'От'}
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-yellow-400 outline-none transition-colors placeholder-gray-400"
                        />
                        <span className="text-gray-400">-</span>
                        <input 
                            type="number" 
                            placeholder={lang === 'uz' ? 'Gacha' : 'До'}
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-yellow-400 outline-none transition-colors placeholder-gray-400"
                        />
                    </div>

                    {availableBrands.length > 0 && (
                        <>
                            <h3 className="font-extrabold text-sm mb-3 text-gray-800 uppercase tracking-wide">
                                {lang === 'uz' ? 'Brend' : 'Бренд'}
                            </h3>
                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar">
                                {availableBrands.map(brand => (
                                    <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                                        <div className="relative flex items-center justify-center w-5 h-5 rounded border border-gray-300 group-hover:border-yellow-400 bg-white transition-colors">
                                            <input 
                                                type="checkbox" 
                                                className="peer opacity-0 absolute inset-0 cursor-pointer"
                                                checked={selectedBrands.includes(brand)}
                                                onChange={() => toggleBrand(brand)}
                                            />
                                            {selectedBrands.includes(brand) && (
                                                <div className="w-full h-full bg-yellow-400 rounded-sm flex items-center justify-center">
                                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </>
                    )}

                    {(minPrice || maxPrice || selectedBrands.length > 0) && (
                        <button 
                            onClick={() => { setMinPrice(''); setMaxPrice(''); setSelectedBrands([]); }}
                            className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-lg transition-colors"
                        >
                            {lang === 'uz' ? 'Filtrni tozalash' : 'Очистить фильтры'}
                        </button>
                    )}
                </aside>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Sort bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 bg-white p-3 md:p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <h1 className="text-lg font-extrabold text-gray-900 line-clamp-1">{title}
                            <span className="text-gray-400 font-medium text-sm ml-2">({filtered.length})</span>
                        </h1>
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
                            <span className="text-xs text-gray-400 uppercase font-bold mr-1 hidden md:block">
                                {lang === 'uz' ? 'Saralash:' : 'Сортировка:'}
                            </span>
                            {[
                                { v: '', l: lang === 'uz' ? 'Standart' : 'По умолч.' },
                                { v: 'price_asc', l: lang === 'uz' ? 'Arzon↑' : 'Дешевле↑' },
                                { v: 'price_desc', l: lang === 'uz' ? 'Qimmat↓' : 'Дороже↓' },
                                { v: 'new', l: lang === 'uz' ? 'Yangi' : 'Новинки' },
                            ].map(s => (
                                <Link key={s.v}
                                    href={`/catalog?${new URLSearchParams({ ...(activeCategory && { category: activeCategory }), ...(searchStr && { search: searchStr }), ...(s.v && { sort: s.v }) }).toString()}`}
                                    className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sort === s.v ? 'bg-yellow-400 text-black shadow-sm' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-yellow-300'
                                        }`}>
                                    {s.l}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    {filtered.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 py-24 text-center">
                            <p className="text-5xl mb-4">🔍</p>
                            <p className="text-gray-600 font-medium">{lang === 'uz' ? 'Bunday parametrli mahsulot topilmadi' : 'Товары по таким параметрам не найдены'}</p>
                            <button 
                                onClick={() => { setMinPrice(''); setMaxPrice(''); setSelectedBrands([]); }}
                                className="mt-5 inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
                            >
                                {lang === 'uz' ? 'Filtrni tozalash' : 'Очистить фильтры'}
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
                            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
