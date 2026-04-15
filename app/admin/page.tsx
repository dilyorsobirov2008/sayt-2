'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Old /admin route — redirect everyone to the unified /login page
export default function AdminRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/login');
    }, [router]);
    return null;
}
