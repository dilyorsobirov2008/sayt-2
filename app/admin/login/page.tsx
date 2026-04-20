'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Oddiy tekshiruv admin uchun
        if (
            (email === 'dilyorsobirov04@gmail.com' && password === 'dilyor1234') ||
            (email === 'abdujalil@gmail.com' && password === 'abdujalil1234')
        ) {
            localStorage.setItem('admin_auth', 'true');
            router.push('/admin/dashboard');
        } else {
            setError("Email yoki parol noto'g'ri");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md border border-gray-100">
                <h1 className="text-2xl font-bold mb-6 text-center">Admin Paneliga Kirish</h1>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full border p-3 rounded-xl focus:border-yellow-400 outline-none" required />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">Parol</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full border p-3 rounded-xl focus:border-yellow-400 outline-none" required />
                    </div>
                    <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors">
                        Kirish
                    </button>
                </form>
            </div>
        </div>
    );
}
