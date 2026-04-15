'use client';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import { X, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

interface SidebarFilterProps {
    onFilter: (filters: FilterState) => void;
    currentFilters: FilterState;
}

export interface FilterState {
    category: string;
    brands: string[];
    minPrice: number;
    maxPrice: number;
    inStockOnly: boolean;
    sort: string;
}

const allBrands = ['Apple', 'Samsung', 'Xiaomi', 'LG', 'Sony', 'Dell', 'Lenovo', 'Bosch', 'Dyson', 'Canon', 'Google'];

export function SidebarFilter({ onFilter, currentFilters }: SidebarFilterProps) {
    const { lang, categories } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [local, setLocal] = useState<FilterState>(currentFilters);

    const apply = () => { onFilter(local); setMobileOpen(false); };
    const reset = () => {
        const empty: FilterState = { category: '', brands: [], minPrice: 0, maxPrice: 50000000, inStockOnly: false, sort: '' };
        setLocal(empty);
        onFilter(empty);
        setMobileOpen(false);
    };

    const toggleBrand = (b: string) =>
        setLocal(prev => ({
            ...prev,
            brands: prev.brands.includes(b) ? prev.brands.filter(x => x !== b) : [...prev.brands, b]
        }));

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Sort */}
            <div>
                <h4 className="font-semibold text-sm mb-2">{t.filter.sort}</h4>
                <div className="space-y-1.5">
                    {[
                        { v: '', label: lang === 'uz' ? 'Standart' : 'Стандарт' },
                        { v: 'price_asc', label: lang === 'uz' ? 'Arzon avval' : 'Сначала дешевле' },
                        { v: 'price_desc', label: lang === 'uz' ? 'Qimmat avval' : 'Сначала дороже' },
                        { v: 'rating', label: t.filter.sortRating },
                        { v: 'new', label: t.filter.sortNew },
                    ].map(opt => (
                        <label key={opt.v} className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
                            <input type="radio" name="sort" value={opt.v} checked={local.sort === opt.v}
                                onChange={() => setLocal(p => ({ ...p, sort: opt.v }))}
                                className="accent-yellow-400" />
                            <span className="text-sm">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category */}
            <div>
                <h4 className="font-semibold text-sm mb-2">{lang === 'uz' ? 'Kategoriya' : 'Категория'}</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
                            <input type="radio" name="category" value={cat.slug}
                                checked={local.category === cat.slug}
                                onChange={() => setLocal(p => ({ ...p, category: cat.slug }))}
                                className="accent-yellow-400" />
                            <span className="text-sm">{cat.icon} {lang === 'uz' ? cat.name : cat.nameRu}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div>
                <h4 className="font-semibold text-sm mb-2">{t.filter.priceRange}</h4>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-gray-500">{t.filter.minPrice}</label>
                        <input type="number" value={local.minPrice}
                            onChange={e => setLocal(p => ({ ...p, minPrice: +e.target.value }))}
                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-yellow-400 outline-none"
                            placeholder="0" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">{t.filter.maxPrice}</label>
                        <input type="number" value={local.maxPrice}
                            onChange={e => setLocal(p => ({ ...p, maxPrice: +e.target.value }))}
                            className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:border-yellow-400 outline-none"
                            placeholder="50000000" />
                    </div>
                </div>
            </div>

            {/* Brands */}
            <div>
                <h4 className="font-semibold text-sm mb-2">{t.filter.brands}</h4>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {allBrands.map(brand => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer hover:text-yellow-600">
                            <input type="checkbox" checked={local.brands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                                className="accent-yellow-400" />
                            <span className="text-sm">{brand}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* In Stock */}
            <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={local.inStockOnly}
                    onChange={e => setLocal(p => ({ ...p, inStockOnly: e.target.checked }))}
                    className="accent-yellow-400" />
                <span className="text-sm font-medium">{t.filter.inStockOnly}</span>
            </label>

            {/* Buttons */}
            <div className="flex gap-2">
                <button onClick={apply}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2.5 rounded-xl text-sm transition-colors">
                    {t.filter.apply}
                </button>
                <button onClick={reset}
                    className="px-4 border border-gray-200 hover:border-gray-400 rounded-xl text-sm font-medium transition-colors">
                    {t.filter.reset}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Filter Button */}
            <button onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-yellow-100 rounded-xl text-sm font-medium transition-colors">
                <SlidersHorizontal size={16} />
                {t.filter.title}
            </button>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <div className="relative bg-white w-80 max-w-full h-full overflow-y-auto p-6 ml-auto shadow-xl animate-slideDown">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">{t.filter.title}</h3>
                            <button onClick={() => setMobileOpen(false)}><X size={20} /></button>
                        </div>
                        <FilterContent />
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                <h3 className="text-base font-bold mb-5 flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-yellow-500" />
                    {t.filter.title}
                </h3>
                <FilterContent />
            </div>
        </>
    );
}
