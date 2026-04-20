'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import { Home, LayoutGrid, ShoppingCart, Heart, User } from 'lucide-react';

export function MobileNav() {
    const pathname = usePathname();
    const { lang, cartCount } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const count = cartCount();

    const links = [
        { href: '/', label: t.nav.home, icon: Home },
        { href: '/catalog', label: t.nav.catalog, icon: LayoutGrid },
        { href: '/cart', label: t.nav.cart, icon: ShoppingCart, badge: count },
        { href: '/favorites', label: t.nav.favorites, icon: Heart },
        { href: '/profile', label: lang === 'uz' ? 'Profil' : 'Профиль', icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
            <div className="flex items-center justify-around h-14">
                {links.map(({ href, label, icon: Icon, badge }) => {
                    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                    return (
                        <Link key={href} href={href}
                            className={`flex flex-col items-center gap-0.5 flex-1 py-2 relative transition-colors ${active ? 'text-yellow-500' : 'text-gray-500'}`}>
                            <span className="relative">
                                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                                {badge !== undefined && badge > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1">
                                        {badge}
                                    </span>
                                )}
                            </span>
                            <span className="text-[9px] font-medium leading-none">{label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
