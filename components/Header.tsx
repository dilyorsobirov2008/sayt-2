'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import { Search, ShoppingCart, Heart, ChevronDown, LayoutGrid } from 'lucide-react';
import { MegaMenu } from './MegaMenu';

export function Header() {
    const { lang, setLang, cartCount, searchQuery, setSearchQuery, megaMenuOpen, setMegaMenuOpen } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const count = cartCount();
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) router.push(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <>
            {/* ── MOBILE HEADER ── */}
            <header className="md:hidden sticky top-0 z-40 bg-white shadow-sm">
                {/* Top row: logo + icons */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
                    <Link href="/" className="flex-shrink-0">
                        <span className="text-xl font-extrabold tracking-tight text-gray-900">
                            ashinde
                        </span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
                            className="text-xs font-bold text-gray-500 border border-gray-200 rounded-lg px-2 py-1">
                            {lang.toUpperCase()}
                        </button>
                        <Link href="/favorites" className="text-gray-600 relative">
                            <Heart size={22} strokeWidth={1.8} />
                        </Link>
                        <Link href="/cart" className="text-gray-600 relative">
                            <ShoppingCart size={22} strokeWidth={1.8} />
                            {count > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                                    {count}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
                {/* Search row */}
                <div className="px-3 py-2 bg-white">
                    <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={t.header.search}
                            className="flex-1 pl-4 pr-2 py-2.5 bg-transparent text-sm outline-none"
                        />
                        <button type="submit" className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-500 transition-colors">
                            <Search size={18} className="text-black" />
                        </button>
                    </form>
                </div>
            </header>

            {/* ── DESKTOP HEADER ── */}
            <header className="hidden md:block sticky top-0 z-40 bg-white shadow-sm relative">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-5">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 mr-2">
                        <span className="text-2xl font-extrabold tracking-tight text-gray-900">
                            ashinde
                        </span>
                    </Link>

                    {/* Catalog button - yellow like Texnomart */}
                    <button
                        onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex-shrink-0 ${megaMenuOpen
                            ? 'bg-yellow-500 text-black'
                            : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                            }`}>
                        <LayoutGrid size={16} />
                        {t.nav.catalog}
                        <ChevronDown size={14} className={`transition-transform ml-1 ${megaMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Search bar - wide, like Texnomart */}
                    <form onSubmit={handleSearch} className="flex-1 flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-200 focus-within:border-yellow-400 transition-colors">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder={t.header.search}
                            className="flex-1 pl-5 pr-2 py-2.5 bg-transparent text-sm outline-none text-gray-800"
                        />
                        <button type="submit" className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 transition-colors">
                            <Search size={18} className="text-black" />
                        </button>
                    </form>

                    {/* Right icons */}
                    <div className="flex items-center gap-5 ml-2">
                        {/* Lang switch */}
                        <div className="flex items-center gap-0 bg-gray-100 rounded-lg overflow-hidden text-xs font-bold border border-gray-200">
                            <button onClick={() => setLang('uz')}
                                className={`px-3 py-1.5 transition-colors ${lang === 'uz' ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-black'}`}>
                                UZ
                            </button>
                            <button onClick={() => setLang('ru')}
                                className={`px-3 py-1.5 transition-colors ${lang === 'ru' ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-black'}`}>
                                RU
                            </button>
                        </div>


                        {/* Favorites */}
                        <Link href="/favorites" className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-black transition-colors">
                            <Heart size={22} strokeWidth={1.8} />
                            <span className="text-[10px] font-medium">{lang === 'uz' ? 'Sevimlilar' : 'Избранное'}</span>
                        </Link>

                        {/* Cart */}
                        <Link href="/cart" className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-black transition-colors relative">
                            <span className="relative">
                                <ShoppingCart size={22} strokeWidth={1.8} />
                                {count > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                                        {count}
                                    </span>
                                )}
                            </span>
                            <span className="text-[10px] font-medium">{lang === 'uz' ? 'Savatcha' : 'Корзина'}</span>
                        </Link>
                    </div>
                </div>

                <MegaMenu />
            </header>
        </>
    );
}
