'use client';
import { useStore } from '@/lib/store';
import { uz, ru } from '@/lib/i18n';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, ChevronLeft, Package, Clock, CheckCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
    const { lang } = useStore();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('user_id');
        const isLoggedIn = localStorage.getItem('user_auth') === 'true';

        if (!isLoggedIn || !userId) {
            router.push('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                const res = await fetch(`/api/orders/my?userId=${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders || []);
                }
            } catch (err) {
                console.error("Xatolik:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Link href="/profile" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ChevronLeft size={20} />
                <span className="text-sm font-medium">{lang === 'uz' ? 'Profilga qaytish' : 'Вернуться в профиль'}</span>
            </Link>

            <h1 className="text-2xl font-extrabold mb-8 flex items-center gap-3">
                <ShoppingBag size={28} className="text-yellow-500" />
                {lang === 'uz' ? 'Mening buyurtmalarim' : 'Мои заказы'}
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={48} className="text-gray-300" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">
                        {lang === 'uz' ? "Hozircha buyurtmalar yo'q" : 'Пока нет заказов'}
                    </h2>
                    <p className="text-gray-500 mb-8 text-sm">
                        {lang === 'uz' ? 'Siz hali hech narsa xarid qilmadingiz.' : 'Вы еще ничего не купили.'}
                    </p>
                    <Link href="/catalog"
                        className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-3 rounded-xl transition-colors">
                        {lang === 'uz' ? 'Xaridni boshlash' : 'Начать покупки'}
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                        {lang === 'uz' ? 'Buyurtma sanasi' : 'Дата заказа'}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                        {order.date}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {order.status === 'new' ? (
                                        <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                                            <Clock size={14} /> {lang === 'uz' ? 'Kutilmoqda' : 'В ожидании'}
                                        </div>
                                    ) : order.status === 'completed' ? (
                                        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold">
                                            <CheckCircle size={14} /> {lang === 'uz' ? 'Bajarildi' : 'Выполнен'}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap">
                                            {order.status}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mt-4 pt-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">
                                    {lang === 'uz' ? 'Mahsulotlar' : 'Товары'}
                                </span>
                                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                                    {order.product}
                                </p>
                            </div>

                            <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
                                <span className="text-sm text-gray-500 font-medium">
                                    {lang === 'uz' ? 'Jami narx:' : 'Итого:'}
                                </span>
                                <span className="text-lg font-extrabold text-gray-900">
                                    {formatPrice(order.amount)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
