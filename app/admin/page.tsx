'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Old /admin route — redirect to admin login
export default function AdminRedirect() {
    const router = useRouter();
    useEffect(() => {
        router.replace('/admin/login');
    }, [router]);

    return null;
}
