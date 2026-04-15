'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { Footer } from './Footer';
import { useStore } from '@/lib/store';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');
    const fetchAll = useStore((s) => s.fetchAll);
    const hasHydrated = useStore((s) => s.hasHydrated);

    // Sayt ochilganda API dan barcha ma'lumotlarni yuklash
    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    // Unique visitor tracking — API orqali
    useEffect(() => {
        const key = 'techshop-visitor-fp';
        let fp = localStorage.getItem(key);
        if (!fp) {
            // Oddiy fingerprint yaratish
            fp = 'v_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
            localStorage.setItem(key, fp);
        }
        fetch('/api/visitors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fingerprint: fp }),
        }).catch(() => {});
    }, []);

    if (!hasHydrated) {
        return <div className="min-h-screen bg-black" />; // Or a loader
    }

    return (
        <>
            {!isAdmin && <Header />}
            <main className={!isAdmin ? 'pb-20 md:pb-0' : ''}>
                {children}
            </main>
            {!isAdmin && <Footer />}
            {!isAdmin && <MobileNav />}

            {/* Discreet admin link — bottom-left corner */}
            {!isAdmin && (
                <Link
                    href="/login"
                    className="hidden md:flex fixed bottom-3 left-3 z-50 w-6 h-6 items-center justify-center rounded-full bg-gray-100 opacity-20 hover:opacity-80 transition-opacity duration-300"
                    title="Admin"
                >
                    <span className="text-[8px] font-bold text-gray-600 select-none">A</span>
                </Link>
            )}
        </>
    );
}
