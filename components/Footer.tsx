'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';

export function Footer() {
    const { lang } = useStore();

    return (
        <footer className="bg-gray-900 text-gray-300 mt-8">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                    {/* Contact */}
                    <div>
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
                            <a href="https://instagram.com" target="_blank" rel="noreferrer"
                                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-pink-500 flex items-center justify-center transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href="https://youtube.com" target="_blank" rel="noreferrer"
                                className="w-8 h-8 rounded-full bg-gray-700 hover:bg-red-500 flex items-center justify-center transition-colors">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Kompaniya */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-3">{lang === 'uz' ? 'Kompaniya' : 'Компания'}</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Biz haqimizda' : 'О нас'}</Link></li>
                            <li><Link href="/blog" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'Yangiliklar' : 'Новости'}</Link></li>
                            <li><Link href="/careers" className="hover:text-yellow-400 transition-colors">{lang === 'uz' ? 'IMEI tekshirish' : 'Проверка IMEI'}</Link></li>
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
                    {/* AI-generated payment logos */}
                    <div className="flex items-center gap-2">
                        <Image src="/uzum-logo.png" alt="Uzum Bank" width={36} height={36} className="rounded-lg" />
                        <Image src="/click-logo.png" alt="Click" width={52} height={36} className="rounded-lg" />
                        <Image src="/payme-logo.png" alt="Payme" width={52} height={36} className="rounded-lg" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
