'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ADMIN_EMAIL = 'dilyorsobirov04@gmail.com';
const ADMIN_PASS = 'dilyor1234';

export default function LoginPage() {
    const router = useRouter();

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');

        // Check admin
        if (loginEmail === ADMIN_EMAIL && loginPass === ADMIN_PASS) {
            localStorage.setItem('admin_auth', 'true');
            localStorage.setItem('user_name', 'Admin');
            localStorage.setItem('user_email', loginEmail);
            router.push('/admin/dashboard');
            return;
        }

        setLoginError("Email yoki parol noto'g'ri!");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
                            ashinde
                        </h1>
                    </Link>
                    <p className="text-gray-500 text-sm mt-2">
                        Admin panelga kirish
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-8">
                        {/* ── LOGIN ── */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            {loginError && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                                    ❌ {loginError}
                                </div>
                            )}

                            <div>
                                <label className="text-gray-600 text-xs font-semibold block mb-1.5">Email</label>
                                <input
                                    type="email" value={loginEmail}
                                    onChange={e => setLoginEmail(e.target.value)}
                                    placeholder="admin@gmail.com" required
                                    className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                                />
                            </div>
                            <div>
                                <label className="text-gray-600 text-xs font-semibold block mb-1.5">Parol</label>
                                <input
                                    type="password" value={loginPass}
                                    onChange={e => setLoginPass(e.target.value)}
                                    placeholder="Parolingiz" required
                                    className="w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400"
                                />
                            </div>

                            <button type="submit"
                                className="w-full bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] text-black font-extrabold py-3.5 rounded-xl transition-all text-sm mt-1">
                                Kirish →
                            </button>
                        </form>
                    </div>
                </div>

                {/* Back to home */}
                <p className="text-center text-gray-400 text-xs mt-4">
                    <Link href="/" className="hover:text-gray-600 transition-colors">
                        ← Bosh sahifaga qaytish
                    </Link>
                </p>
            </div>
        </div>
    );
}
