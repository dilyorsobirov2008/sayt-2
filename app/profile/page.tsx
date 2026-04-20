'use client';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, ShoppingBag, Settings, ChevronRight, Heart, Shield, LogIn, LogOut } from 'lucide-react';

export default function ProfilePage() {
    const { lang, setLang, cart, favorites } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        setIsAdmin(localStorage.getItem('admin_auth') === 'true');
        setIsLoggedIn(localStorage.getItem('user_auth') === 'true');
        setUserName(localStorage.getItem('user_name') || '');
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user_auth');
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserName('');
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            {/* Avatar */}
            <div className="flex flex-col items-center gap-3 mb-8">
                <div className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center">
                    <User size={48} className="text-yellow-500" />
                </div>
                <h1 className="text-xl font-extrabold">
                    {isLoggedIn || isAdmin ? userName : t.profile.title}
                </h1>
                <p className="text-sm text-gray-500">
                    {isAdmin ? '👑 Administrator' : isLoggedIn ? 'Foydalanuvchi' : t.profile.loggedOut}
                </p>
            </div>

            {/* Menu links */}
            <div className="space-y-2 mb-4">
                {[
                    { icon: ShoppingBag, label: lang === 'uz' ? 'Buyurtmalarim' : 'Мои заказы', href: '/orders', badge: null },
                    { icon: Heart, label: lang === 'uz' ? 'Sevimlilar' : 'Избранное', href: '/favorites', badge: favorites.length || null },
                    { icon: ShoppingBag, label: lang === 'uz' ? 'Savatcha' : 'Корзина', href: '/cart', badge: cartCount || null },
                ].map(({ icon: Icon, label, href, badge }) => (
                    <Link key={label} href={href}
                        className="flex items-center gap-4 bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:border-yellow-300 hover:bg-yellow-50 transition-all group">
                        <Icon size={20} className="text-gray-500 group-hover:text-yellow-600" />
                        <span className="font-medium text-sm flex-1">{label}</span>
                        {badge !== null && badge! > 0 && (
                            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">{badge}</span>
                        )}
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-yellow-500" />
                    </Link>
                ))}
            </div>


            {/* Auth block */}
            {isLoggedIn ? (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
                    <p className="text-green-600 text-sm font-medium mb-3">✅ Hisobingizga kirgansiz</p>
                    <button onClick={handleLogout}
                        className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <LogOut size={14} /> Hisobdan chiqish
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
                    <p className="text-gray-500 text-sm mb-3">Hisobingizga kiring yoki ro'yxatdan o'ting</p>
                    <Link href="/login"
                        className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl text-sm transition-colors">
                        <LogIn size={15} />
                        {lang === 'uz' ? 'Kirish / Ro\'yxatdan o\'tish' : 'Войти / Регистрация'}
                    </Link>
                </div>
            )}

            {/* Lang switcher */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <p className="font-semibold text-sm mb-3">{t.header.selectLang}</p>
                <div className="flex gap-3">
                    {(['uz', 'ru'] as const).map(l => (
                        <button key={l} onClick={() => setLang(l)}
                            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${lang === l ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'}`}>
                            {l === 'uz' ? "🇺🇿 O'zbekcha" : '🇷🇺 Русский'}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
