'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';

export default function LoginPage() {
    const router = useRouter();
    const { lang } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const [tab, setTab] = useState<'login' | 'register'>('login');

    // Login
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPass, setLoginPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Register
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('+998 ');
    const [regEmail, setRegEmail] = useState('');
    const [regPass, setRegPass] = useState('');
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState('');
    const [regLoading, setRegLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError('');
        setLoginLoading(true);

        // Admin tekshiruvi
        if (
            (loginEmail === 'dilyorsobirov04@gmail.com' && loginPass === 'dilyor1234') ||
            (loginEmail === 'abdujalil@gmail.com' && loginPass === 'abdujalil1234')
        ) {
            localStorage.setItem('admin_auth', 'true');
            const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/admin/dashboard';
            router.push(returnUrl);
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPass }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user_auth', 'true');
                localStorage.setItem('user_id', String(data.id));
                localStorage.setItem('user_name', `${data.firstName} ${data.lastName}`.trim());
                localStorage.setItem('user_email', data.email);
                localStorage.setItem('user_phone', data.phone || '');
                const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/profile';
                router.push(returnUrl);
            } else {
                setLoginError(data.error || t.auth.wrongCredentials);
            }
        } catch {
            setLoginError(t.auth.generalError);
        }
        setLoginLoading(false);
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegError('');
        setRegSuccess('');
        setRegLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, phone, email: regEmail, password: regPass }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('user_auth', 'true');
                localStorage.setItem('user_id', String(data.id));
                localStorage.setItem('user_name', `${data.firstName} ${data.lastName}`.trim());
                localStorage.setItem('user_email', data.email);
                localStorage.setItem('user_phone', data.phone || '');
                setRegSuccess(t.auth.successRegister);
                const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/profile';
                setTimeout(() => router.push(returnUrl), 1200);
            } else {
                setRegError(data.error || t.auth.generalError);
            }
        } catch {
            setRegError(t.auth.generalError);
        }
        setRegLoading(false);
    };

    const inputClass = "w-full border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:border-yellow-400 outline-none transition-colors bg-gray-50 focus:bg-white placeholder-gray-400";
    const labelClass = "text-gray-600 text-xs font-semibold block mb-1.5";

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">ashinde</h1>
                    </Link>
                    <p className="text-gray-500 text-sm mt-2">{t.auth.subtitle}</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                    <button onClick={() => setTab('login')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'login' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t.auth.loginTitle}
                    </button>
                    <button onClick={() => setTab('register')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === 'register' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t.auth.registerTitle}
                    </button>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <div className="p-8">
                        {tab === 'login' ? (
                            <form onSubmit={handleLogin} className="space-y-4">
                                {loginError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">❌ {loginError}</div>
                                )}
                                <div>
                                    <label className={labelClass}>{t.auth.email}</label>
                                    <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                                        placeholder={t.auth.emailPlaceholder} required className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.auth.password}</label>
                                    <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)}
                                        placeholder={t.auth.passwordPlaceholder} required className={inputClass} />
                                </div>
                                <button type="submit" disabled={loginLoading}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 active:scale-[0.98] text-black font-extrabold py-3.5 rounded-xl transition-all text-sm">
                                    {loginLoading ? t.auth.loginLoading : t.auth.loginButton}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleRegister} className="space-y-4">
                                {regError && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">❌ {regError}</div>
                                )}
                                {regSuccess && (
                                    <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-xl px-4 py-3">✅ {regSuccess}</div>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className={labelClass}>{t.auth.firstName} {t.auth.required}</label>
                                        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                                            placeholder={t.auth.firstNamePlaceholder} required className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t.auth.lastName}</label>
                                        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                                            placeholder={t.auth.lastNamePlaceholder} className={inputClass} />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>{t.auth.phone}</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                                        placeholder={t.auth.phonePlaceholder} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.auth.email} {t.auth.required}</label>
                                    <input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)}
                                        placeholder={t.auth.emailPlaceholder} required className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>{t.auth.password} {t.auth.required} ({t.auth.passwordHint})</label>
                                    <input type="password" value={regPass} onChange={e => setRegPass(e.target.value)}
                                        placeholder={t.auth.passwordPlaceholder} required minLength={6} className={inputClass} />
                                </div>
                                <button type="submit" disabled={regLoading}
                                    className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 active:scale-[0.98] text-black font-extrabold py-3.5 rounded-xl transition-all text-sm">
                                    {regLoading ? t.auth.registerLoading : t.auth.registerButton}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <p className="text-center text-gray-400 text-xs mt-4">
                    <Link href="/" className="hover:text-gray-600 transition-colors">{t.auth.backToHome}</Link>
                </p>
            </div>
        </div>
    );
}
