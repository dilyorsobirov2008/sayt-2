'use client';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, ShoppingBag, Settings, ChevronRight, Heart, Shield, LogIn, LogOut, Edit2, X } from 'lucide-react';

export default function ProfilePage() {
    const { lang, setLang, cart, favorites } = useStore();
    const t = lang === 'uz' ? uz : ru;
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    // Edit Profile Modal
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        currentPassword: ''
    });
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        setIsAdmin(localStorage.getItem('admin_auth') === 'true');
        setIsLoggedIn(localStorage.getItem('user_auth') === 'true');
        
        const fullName = localStorage.getItem('user_name') || '';
        setUserName(fullName);

        // Intialize form with current data
        const parts = fullName.split(' ');
        setEditForm(prev => ({
            ...prev,
            firstName: parts[0] || '',
            lastName: parts.slice(1).join(' ') || '',
            email: localStorage.getItem('user_email') || '',
            phone: localStorage.getItem('user_phone') || ''
        }));
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

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setEditError('');
        setEditSuccess('');
        setEditLoading(true);

        try {
            const userId = localStorage.getItem('user_id');
            const res = await fetch('/api/user/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: userId,
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    phone: editForm.phone,
                    email: editForm.email,
                    currentPassword: editForm.currentPassword
                })
            });

            const data = await res.json();
            if (res.ok) {
                const newFullName = `${data.firstName} ${data.lastName}`.trim();
                localStorage.setItem('user_name', newFullName);
                localStorage.setItem('user_email', data.email);
                localStorage.setItem('user_phone', data.phone || '');
                setUserName(newFullName);
                setEditSuccess(t.profile.updateSuccess || "Ma'lumotlar yangilandi!");
                
                // Clear password field for security
                setEditForm(prev => ({ ...prev, currentPassword: '' }));
                
                // Close modal after success
                setTimeout(() => {
                    setShowEditModal(false);
                    setEditSuccess('');
                }, 2000);
            } else {
                setEditError(data.error || "Yangilashda xatolik yuz berdi");
            }
        } catch (err) {
            setEditError("Xatolik yuz berdi");
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            <div className="flex flex-col items-center gap-3 mb-8">
                <div className="w-24 h-24 rounded-full bg-yellow-100 border-4 border-yellow-400 flex items-center justify-center">
                    <User size={48} className="text-yellow-500" />
                </div>
                <h1 className="text-xl font-extrabold">
                    {userName || 'User'}
                </h1>
                <p className="text-sm text-gray-500">
                    {(isLoggedIn || isAdmin) ? t.profile.activeAccount : t.profile.loggedOut}
                </p>
            </div>

            {/* Menu links */}
            <div className="space-y-2 mb-4">
                {[
                    { icon: ShoppingBag, label: t.profile.myOrders, href: '/orders', badge: null },
                    { icon: Heart, label: t.profile.favorites, href: '/favorites', badge: favorites.length || null },
                    { icon: ShoppingBag, label: t.profile.cart, href: '/cart', badge: cartCount || null },
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
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 space-y-3">
                    <p className="text-green-600 text-sm font-medium">{t.profile.loggedIn}</p>
                    
                    <button onClick={() => setShowEditModal(true)}
                        className="w-full border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Edit2 size={16} /> {t.profile.editProfile || "Profilni tahrirlash"}
                    </button>

                    <button onClick={handleLogout}
                        className="w-full border border-red-200 text-red-500 hover:bg-red-50 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <LogOut size={16} /> {t.profile.logout}
                    </button>
                </div>
            ) : (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-4">
                    <p className="text-gray-500 text-sm mb-3">{t.profile.loginPrompt}</p>
                    <Link href="/login"
                        className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-xl text-sm transition-colors">
                        <LogIn size={15} />
                        {t.profile.loginRegister}
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

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
                            <h2 className="font-bold text-lg">{t.profile.editProfile || "Profilni tahrirlash"}</h2>
                            <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-5">
                            {editError && <div className="mb-4 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm border border-red-100">❌ {editError}</div>}
                            {editSuccess && <div className="mb-4 bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm border border-green-100">✅ {editSuccess}</div>}
                            
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-gray-600 text-xs font-semibold block mb-1.5">{lang === 'uz' ? "Ism" : "Имя"}</label>
                                        <input type="text" value={editForm.firstName} onChange={e => setEditForm({...editForm, firstName: e.target.value})}
                                            required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-400 focus:bg-white bg-gray-50" />
                                    </div>
                                    <div>
                                        <label className="text-gray-600 text-xs font-semibold block mb-1.5">{lang === 'uz' ? "Familiya" : "Фамилия"}</label>
                                        <input type="text" value={editForm.lastName} onChange={e => setEditForm({...editForm, lastName: e.target.value})}
                                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-400 focus:bg-white bg-gray-50" />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-gray-600 text-xs font-semibold block mb-1.5">{lang === 'uz' ? "Telefon raqam" : "Номер телефона"}</label>
                                    <input type="tel" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-400 focus:bg-white bg-gray-50" />
                                </div>
                                
                                <div>
                                    <label className="text-gray-600 text-xs font-semibold block mb-1.5">Email</label>
                                    <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})}
                                        required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-yellow-400 focus:bg-white bg-gray-50" />
                                </div>
                                
                                <div className="pt-2 border-t border-gray-100">
                                    <label className="text-gray-600 text-xs font-semibold block mb-1.5 text-red-500">
                                        {t.profile.currentPassword || "Joriy parol"} *
                                    </label>
                                    <input type="password" value={editForm.currentPassword} onChange={e => setEditForm({...editForm, currentPassword: e.target.value})}
                                        placeholder={t.profile.fillPassword || "Parolni kiriting"}
                                        required className="w-full border border-red-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:bg-white bg-red-50" />
                                </div>
                                
                                <button type="submit" disabled={editLoading}
                                    className="mt-2 w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-200 active:scale-[0.98] text-black font-extrabold py-3.5 rounded-xl transition-all text-sm">
                                    {editLoading ? (t.profile.saving || "Saqlanmoqda...") : (t.profile.save || "Saqlash")}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
