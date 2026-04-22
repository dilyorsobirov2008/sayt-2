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
      <section className="px-3 md:px-6 pt-4 md:pt-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
          <BannerSlider />

          {/* Right promo boxes - desktop only */}
          <div className="hidden md:flex flex-col gap-3">
            <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl p-5 flex flex-col justify-end min-h-[150px] relative overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&q=80"
                alt="Samsung S24 Ultra"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-[90%] w-auto object-contain drop-shadow-xl opacity-90 pointer-events-none"
              />
              <p className="text-yellow-400 text-xs font-bold mb-1 relative z-10">Samsung Galaxy</p>
              <p className="text-white text-lg font-extrabold leading-tight relative z-10">S24 Ultra<br />−30%</p>
              <Link href="/catalog?category=smartphones&brand=Samsung"
                className="mt-3 inline-block text-xs bg-yellow-400 text-black font-bold px-3 py-1.5 rounded-lg relative z-10">
                {lang === 'uz' ? "Ko'rish" : "Смотреть"}
              </Link>
            </div>
            <div className="flex-1 bg-gradient-to-br from-yellow-400 to-yellow-300 rounded-xl p-5 flex flex-col justify-end min-h-[150px]">
              <p className="text-black/60 text-xs font-bold mb-1">
                {lang === 'uz' ? "Muddatli to'lov" : "Рассрочка"}
              </p>
              <p className="text-black text-lg font-extrabold leading-tight">3-6-12<br />{lang === 'uz' ? "oy" : "мес"}</p>
              <Link href="/catalog"
                className="mt-3 inline-block text-xs bg-black text-yellow-400 font-bold px-3 py-1.5 rounded-lg">
                {lang === 'uz' ? "Xarid" : "Купить"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-5 px-3 md:px-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
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
      <section className="mt-4 px-3 md:px-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
              🔥 {lang === 'uz' ? 'Xit savdo' : 'Хит продаж'}
            </h2>
            <Link href="/catalog?featured=true" className="text-yellow-600 text-xs font-semibold flex items-center gap-1 hover:gap-1.5 transition-all">
              {t.home.seeAll} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* New arrivals */}
      {newProducts.length > 0 && (
        <section className="mt-4 px-3 md:px-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm md:text-base font-bold text-gray-900 flex items-center gap-2">
                ✨ {lang === 'uz' ? 'Yangi mahsulotlar' : 'Новинки'}
              </h2>
              <Link href="/catalog?sort=new" className="text-yellow-600 text-xs font-semibold flex items-center gap-1">
                {t.home.seeAll} <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {newProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      <section className="mt-4 px-3 md:px-6 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm md:text-base font-bold text-gray-900">
              {lang === 'uz' ? 'Barcha mahsulotlar' : 'Все товары'}
            </h2>
            <Link href="/catalog" className="text-yellow-600 text-xs font-semibold flex items-center gap-1">
              {t.home.seeAll} <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
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
