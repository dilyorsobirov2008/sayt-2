'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';

export function Footer() {
    const { lang } = useStore();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-8 pb-20 md:pb-0">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <p className="text-gray-400 text-xs mb-2 font-medium">
                            {lang === 'uz' ? 'Savolingiz bormi? Qo\'ng\'iroq qiling' : 'Есть вопросы? Позвоните'}
                        </p>
                        <a href="tel:+998975062020"
                            className="text-white text-2xl font-extrabold tracking-tight hover:text-yellow-400 transition-colors block mb-4">
                            +998 97 506 20 20
                        </a>
                        <div className="flex items-center gap-3">
                            <a href="https://t.me" target="_blank" rel="noreferrer"
                                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-blue-500 flex items-center justify-center text-sm font-bold transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.4l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.868.16z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Kompaniya */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-3">{lang === 'uz' ? 'Kompaniya' : 'Компания'}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Biz haqimizda' : 'О нас'}</Link></li>
                            <li><Link href="/blog" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Yangiliklar' : 'Новости'}</Link></li>
                        </ul>
                    </div>

                    {/* Ma'lumot */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-3">{lang === 'uz' ? 'Ma\'lumot' : 'Информация'}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/delivery" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Yetkazib berish' : 'Доставка'}</Link></li>
                            <li><Link href="/warranty" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Kafolat' : 'Гарантия'}</Link></li>
                            <li><Link href="/contact" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Aloqa' : 'Контакты'}</Link></li>
                        </ul>
                    </div>

                    {/* Haridorga yordam */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-3">{lang === 'uz' ? 'Haridorga yordam' : 'Помощь'}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/faq" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Savollar' : 'Вопросы'}</Link></li>
                            <li><Link href="/return" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Qaytarish' : 'Возврат'}</Link></li>
                            <li><Link href="/catalog" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Katalog' : 'Каталог'}</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-gray-500 text-xs">
                        © 2024–2026 Ashinde.uz. {lang === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'Все права защищены.'}
                    </p>
                    {/* Bottom bar */}
                </div>
            </div>
        </footer>
    );
}
