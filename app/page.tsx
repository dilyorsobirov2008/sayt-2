'use client';
import { Suspense } from 'react';
import { BannerSlider } from '@/components/BannerSlider';
import { CategoryScroll } from '@/components/CategoryScroll';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import Link from 'next/link';
import { ArrowRight, SlidersHorizontal } from 'lucide-react';

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { lang, products } = useStore();
  const t = lang === 'uz' ? uz : ru;
  const featured = products.filter(p => p.isFeatured);
  const newProducts = products.filter(p => p.isNew);
  const allVisible = products.slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Banner + Categories row (like Texnomart: side by side on desktop) */}
      <section className="px-2 sm:px-3 md:px-6 pt-3 md:pt-4 md:pt-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-3 md:gap-4">
          <BannerSlider />

          {/* Right promo boxes - desktop only */}
          <div className="hidden md:flex flex-col gap-3">
            <div className="flex-1 bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] rounded-xl p-5 flex flex-col justify-between min-h-[320px] relative overflow-hidden group">
              {/* Background styling to look like a modern promo */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-50 z-0"></div>
              
              <div className="relative z-10 flex flex-col items-start">
                <span className="bg-yellow-400 text-black text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow-sm">
                  {lang === 'uz' ? 'Yetkazib berish' : 'Доставка'}
                </span>
                <h3 className="text-gray-900 text-xl font-extrabold leading-tight">
                  {lang === 'uz' ? 'Tezkor yetkazib berish' : 'Быстрая доставка'}
                </h3>
                <p className="text-gray-600 text-xs mt-2 font-medium">
                  {lang === 'uz' ? "O'zbekiston bo'ylab 24 soat ichida" : "По всему Узбекистану за 24 часа"}
                </p>
              </div>

              {/* Decorative elements representing delivery */}
              <div className="absolute -right-4 -bottom-4 w-40 h-40 bg-yellow-400/20 rounded-full blur-2xl z-0"></div>
              
              <div className="relative z-10 mt-auto pt-6 flex justify-between items-end w-full">
                <Link href="/catalog"
                  className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap shadow-lg">
                  {lang === 'uz' ? "Batafsil" : "Подробнее"}
                </Link>
                {/* Minimalist icon instead of complex image */}
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center rotate-[-10deg] group-hover:rotate-0 transition-all duration-300">
                    <span className="text-3xl">📦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-4 md:mt-5 px-2 sm:px-3 md:px-6">
        <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-bold text-gray-900">{t.home.categories}</h2>
            <div className="flex items-center gap-2">
              <Link href="/catalog" className="flex items-center gap-1.5 bg-gray-100 hover:bg-yellow-50 border border-gray-200 hover:border-yellow-300 text-gray-700 hover:text-yellow-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                <SlidersHorizontal size={13} />
                {lang === 'uz' ? 'Filtr' : 'Фильтры'}
              </Link>
              <Link href="/catalog" className="text-yellow-600 text-xs font-semibold flex items-center gap-1 hover:gap-1.5 transition-all">
                {t.home.seeAll} <ArrowRight size={12} />
              </Link>
            </div>
          </div>
          <Suspense><CategoryScroll /></Suspense>
        </div>
      </section>

      {/* Xit savdo / Best Sellers - like Texnomart "Xit savdo" */}
      <section className="mt-4 px-2 sm:px-3 md:px-6">
        <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
              🔥 {lang === 'uz' ? 'Xit savdo' : 'Хит продаж'}
            </h2>
            <Link href="/catalog?featured=true" className="text-yellow-600 text-xs font-semibold flex items-center gap-1 hover:gap-1.5 transition-all">
              {t.home.seeAll} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      {newProducts.length > 0 && (
        <section className="mt-4 px-2 sm:px-3 md:px-6">
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                ✨ {lang === 'uz' ? 'Yangi mahsulotlar' : 'Новинки'}
              </h2>
              <Link href="/catalog?sort=new" className="text-yellow-600 text-xs font-semibold flex items-center gap-1">
                {t.home.seeAll} <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="mt-4 px-2 sm:px-3 md:px-6 mb-6">
        <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-sm md:text-base font-bold text-gray-900">
              {lang === 'uz' ? 'Barcha mahsulotlar' : 'Все товары'}
            </h2>
            <Link href="/catalog" className="text-yellow-600 text-xs font-semibold flex items-center gap-1">
              {t.home.seeAll} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {allVisible.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Bottom promo banner */}
      <section className="mx-3 md:mx-6 mb-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-yellow-400 text-xs font-bold mb-1">ashinde</p>
          <h3 className="text-xl md:text-2xl font-extrabold text-white">
            {lang === 'uz' ? "3-6-12 muddatli to'lov!" : "Рассрочка 3-6-12!"}
          </h3>
        </div>
        <Link href="/catalog"
          className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3 rounded-xl font-extrabold text-sm transition-colors whitespace-nowrap">
          {lang === 'uz' ? "Xarid qilish" : "Купить"} →
        </Link>
      </section>
    </div>
  );
}
