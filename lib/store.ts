'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product, Language, Category, Brand } from './types';

export interface InstallmentPlan {
    id: number;
    months: number;
    interestPercent: number;
    isActive: boolean;
}

interface StoreState {
    // Cart (localStorage - per user)
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    cartTotal: () => number;
    cartCount: () => number;

    // Favorites (localStorage - per user)
    favorites: number[];
    toggleFavorite: (productId: number) => void;
    isFavorite: (productId: number) => boolean;

    // Language (localStorage - per user)
    lang: Language;
    setLang: (lang: Language) => void;

    // Search
    searchQuery: string;
    setSearchQuery: (q: string) => void;

    // Mega Menu
    megaMenuOpen: boolean;
    setMegaMenuOpen: (v: boolean) => void;

    // ═══ DATABASE DATA (fetched from API) ═══
    products: Product[];
    categories: Category[];
    brands: Brand[];
    orders: any[];
    visitors: number;
    installmentPlans: InstallmentPlan[];
    banners: Banner[];
    hasHydrated: boolean;
    setHasHydrated: (v: boolean) => void;

    // Loaders
    loading: boolean;

    // Fetch functions
    fetchProducts: () => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchBrands: () => Promise<void>;
    fetchOrders: () => Promise<void>;
    fetchVisitors: () => Promise<void>;
    fetchInstallmentPlans: () => Promise<void>;
    fetchBanners: () => Promise<void>;
    fetchAll: () => Promise<void>;

    // Setters (for optimistic updates)
    setProducts: (products: Product[]) => void;
    setCategories: (categories: Category[]) => void;
    setBrands: (brands: Brand[]) => void;
    setOrders: (orders: any[]) => void;
    setVisitors: (visitors: number) => void;
    setInstallmentPlans: (plans: InstallmentPlan[]) => void;
    setBanners: (banners: Banner[]) => void;
}

export const useStore = create<StoreState>()(
    persist(
        (set: any, get: any) => ({
            // Cart
            cart: [] as CartItem[],
            addToCart: (product: Product) => {
                const existing = get().cart.find((i: any) => i.product.id === product.id);
                if (existing) {
                    set((s: any) => ({
                        cart: s.cart.map((i: any) =>
                            i.product.id === product.id
                                ? { ...i, quantity: i.quantity + 1 }
                                : i
                        )
                    }));
                } else {
                    set((s: any) => ({ cart: [...s.cart, { product, quantity: 1 }] }));
                }
            },
            removeFromCart: (productId: number) =>
                set((s: any) => ({ cart: s.cart.filter((i: any) => i.product.id !== productId) })),
            updateQuantity: (productId: number, quantity: number) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                } else {
                    set((s: any) => ({
                        cart: s.cart.map((i: any) =>
                            i.product.id === productId ? { ...i, quantity } : i
                        )
                    }));
                }
            },
            clearCart: () => set({ cart: [] as CartItem[] }),
            cartTotal: () => get().cart.reduce((sum: number, i: any) => sum + i.product.price * i.quantity, 0),
            cartCount: () => get().cart.reduce((sum: number, i: any) => sum + i.quantity, 0),

            // Favorites
            favorites: [] as number[],
            toggleFavorite: (productId: number) =>
                set((s: any) => ({
                    favorites: s.favorites.includes(productId)
                        ? s.favorites.filter((id: number) => id !== productId)
                        : [...s.favorites, productId]
                })),
            isFavorite: (productId: number) => get().favorites.includes(productId),

            // Language
            lang: 'uz' as Language,
            setLang: (lang: Language) => set({ lang }),

            // Search
            searchQuery: '' as string,
            setSearchQuery: (q: string) => set({ searchQuery: q }),

            // Mega Menu
            megaMenuOpen: false as boolean,
            setMegaMenuOpen: (v: boolean) => set({ megaMenuOpen: v }),

            // Database data (initial empty, loaded from API)
            products: [] as Product[],
            categories: [] as Category[],
            brands: [] as Brand[],
            orders: [] as any[],
            visitors: 0 as number,
            installmentPlans: [] as InstallmentPlan[],
            hasHydrated: false as boolean,
            setHasHydrated: (v: boolean) => set({ hasHydrated: v }),
            loading: false as boolean,

            // Fetch functions — API dan ma'lumot olish
            fetchProducts: async () => {
                try {
                    const res = await fetch('/api/products', { cache: 'no-store' });
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const data = await res.json();
                    set({ products: Array.isArray(data.products) ? data.products : [] });
                } catch (e) { 
                    console.error('fetchProducts error:', e);
                    set({ products: [] });
                }
            },

            fetchCategories: async () => {
                try {
                    const res = await fetch('/api/categories', { cache: 'no-store' });
                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const data = await res.json();
                    set({ categories: Array.isArray(data.categories) ? data.categories : [] });
                } catch (e) { 
                    console.error('fetchCategories error:', e);
                    set({ categories: [] });
                }
            },

            fetchBrands: async () => {
                try {
                    const res = await fetch('/api/brands', { cache: 'no-store' });
                    const data = await res.json();
                    set({ brands: data.brands || [] });
                } catch (e) { console.error('fetchBrands error:', e); }
            },

            fetchOrders: async () => {
                try {
                    const res = await fetch('/api/orders', { cache: 'no-store' });
                    const data = await res.json();
                    set({ orders: data.orders || [] });
                } catch (e) { console.error('fetchOrders error:', e); }
            },

            fetchVisitors: async () => {
                try {
                    const res = await fetch('/api/visitors', { cache: 'no-store' });
                    const data = await res.json();
                    set({ visitors: data.count || 0 });
                } catch (e) { console.error('fetchVisitors error:', e); }
            },

            fetchInstallmentPlans: async () => {
                try {
                    const res = await fetch('/api/installment-plans', { cache: 'no-store' });
                    const data = await res.json();
                    set({ installmentPlans: data.plans || [] });
                } catch (e) { console.error('fetchInstallmentPlans error:', e); }
            },

            fetchAll: async () => {
                set({ loading: true });
                await Promise.all([
                    get().fetchProducts(),
                    get().fetchCategories(),
                    get().fetchBrands(),
                    get().fetchInstallmentPlans(),
                ]);
                set({ loading: false });
            },

            // Setters
            setProducts: (products: Product[]) => set({ products }),
            setCategories: (categories: Category[]) => set({ categories }),
            setBrands: (brands: Brand[]) => set({ brands }),
            setOrders: (orders: any[]) => set({ orders }),
            setVisitors: (visitors: number) => set({ visitors }),
            setInstallmentPlans: (plans: InstallmentPlan[]) => set({ installmentPlans: plans }),
        }),
        {
            name: 'techshop-store',
            partialize: (state: any) => ({
                cart: state.cart,
                favorites: state.favorites,
                lang: state.lang,
                products: state.products,
                categories: state.categories,
                brands: state.brands,
                installmentPlans: state.installmentPlans,
            }),
            onRehydrateStorage: () => {
                return (state: any) => {
                   state?.setHasHydrated(true);
                };
            },
        }
    )
);
