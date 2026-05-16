'use client';
import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import {
  CartItem,
  Product,
  Language,
  Category,
  Brand,
  Banner,
  Order,
  InstallmentPlan,
  SelectedColorObj,
  ProductsApiResponse,
  CategoriesApiResponse,
  BrandsApiResponse,
  OrdersApiResponse,
  BannersApiResponse,
  InstallmentPlansApiResponse,
  VisitorsApiResponse,
} from './types';

// ─── Store State ──────────────────────────────────────────────────────────────

interface StoreState {
  // ── Cart ──
  cart: CartItem[];
  addToCart: (
    product: Product,
    selectedColorObj?: SelectedColorObj | string,
    selectedVariant?: CartItem['selectedVariant']
  ) => void;
  removeFromCart: (
    productId: number,
    selectedColorName?: string,
    selectedVariantId?: number
  ) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    selectedColorName?: string,
    selectedVariantId?: number
  ) => void;
  clearCart: () => void;
  cartTotal: () => number;
  cartCount: () => number;

  // ── Favorites ──
  favorites: number[];
  toggleFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;

  // ── Language ──
  lang: Language;
  setLang: (lang: Language) => void;

  // ── Search ──
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // ── Mega Menu ──
  megaMenuOpen: boolean;
  setMegaMenuOpen: (v: boolean) => void;

  // ── Database Data ──
  products: Product[];
  categories: Category[];
  brands: Brand[];
  orders: Order[];
  visitors: number;
  installmentPlans: InstallmentPlan[];
  banners: Banner[];
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  loading: boolean;

  // ── Fetch Functions ──
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchBrands: () => Promise<void>;
  fetchOrders: () => Promise<void>;
  fetchVisitors: () => Promise<void>;
  fetchInstallmentPlans: () => Promise<void>;
  fetchBanners: () => Promise<void>;
  fetchAll: () => Promise<void>;

  // ── Setters ──
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  setBrands: (brands: Brand[]) => void;
  setOrders: (orders: Order[]) => void;
  setVisitors: (visitors: number) => void;
  setInstallmentPlans: (plans: InstallmentPlan[]) => void;
  setBanners: (banners: Banner[]) => void;
}

// ─── Persist Config ───────────────────────────────────────────────────────────

type PersistedState = Pick<
  StoreState,
  'cart' | 'favorites' | 'lang' | 'products' | 'categories' | 'brands' | 'installmentPlans'
>;

// ─── Helper ───────────────────────────────────────────────────────────────────

function matchesCartItem(
  item: CartItem,
  productId: number,
  selectedColorName?: string,
  selectedVariantId?: number
): boolean {
  return (
    item.product.id === productId &&
    item.selectedColor === selectedColorName &&
    item.selectedVariant?.id === selectedVariantId
  );
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ── Cart ──
      cart: [],

      addToCart: (product, selectedColorObj, selectedVariant) => {
        const cartList = get().cart;

        const colorName =
          typeof selectedColorObj === 'string'
            ? selectedColorObj
            : selectedColorObj?.colorName;

        const colorPrice =
          typeof selectedColorObj === 'object' && selectedColorObj?.price
            ? Number(selectedColorObj.price)
            : 0;

        const index = cartList.findIndex(
          (i) =>
            i.product.id === product.id &&
            i.selectedColor === colorName &&
            i.selectedVariant?.id === selectedVariant?.id
        );

        if (index >= 0) {
          const newCart = [...cartList];
          newCart[index] = {
            ...newCart[index],
            quantity: newCart[index].quantity + 1,
          };
          set({ cart: newCart });
        } else {
          set({
            cart: [
              ...cartList,
              {
                product,
                quantity: 1,
                selectedColor: colorName,
                selectedColorPrice: colorPrice,
                selectedVariant,
              },
            ],
          });
        }
      },

      removeFromCart: (productId, selectedColorName, selectedVariantId) => {
        if (selectedColorName === undefined && selectedVariantId === undefined) {
          set((s) => ({ cart: s.cart.filter((i) => i.product.id !== productId) }));
          return;
        }
        set((s) => ({
          cart: s.cart.filter(
            (i) => !matchesCartItem(i, productId, selectedColorName, selectedVariantId)
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedColorName, selectedVariantId) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, selectedColorName, selectedVariantId);
          return;
        }
        set((s) => ({
          cart: s.cart.map((i) =>
            matchesCartItem(i, productId, selectedColorName, selectedVariantId)
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      cartTotal: () =>
        get().cart.reduce((sum, i) => {
          const base = Number(i.product.price);
          const storage = i.selectedVariant ? Number(i.selectedVariant.price) : 0;
          const color = i.selectedColorPrice ? Number(i.selectedColorPrice) : 0;
          return sum + (base + storage + color) * i.quantity;
        }, 0),

      cartCount: () =>
        get().cart.reduce((sum, i) => sum + i.quantity, 0),

      // ── Favorites ──
      favorites: [],

      toggleFavorite: (productId) =>
        set((s) => ({
          favorites: s.favorites.includes(productId)
            ? s.favorites.filter((id) => id !== productId)
            : [...s.favorites, productId],
        })),

      isFavorite: (productId) => get().favorites.includes(productId),

      // ── Language ──
      lang: 'uz',
      setLang: (lang) => set({ lang }),

      // ── Search ──
      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      // ── Mega Menu ──
      megaMenuOpen: false,
      setMegaMenuOpen: (v) => set({ megaMenuOpen: v }),

      // ── Database Data ──
      products: [],
      categories: [],
      brands: [],
      orders: [],
      visitors: 0,
      installmentPlans: [],
      banners: [],
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      loading: false,

      // ── Fetch Functions ──
      fetchProducts: async () => {
        try {
          const res = await fetch('/api/products', { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data: ProductsApiResponse = await res.json();
          set({ products: Array.isArray(data.products) ? data.products : [] });
        } catch (e) {
          console.error('[store] fetchProducts error:', e);
          set({ products: [] });
        }
      },

      fetchCategories: async () => {
        try {
          const res = await fetch('/api/categories', { cache: 'no-store' });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data: CategoriesApiResponse = await res.json();
          set({ categories: Array.isArray(data.categories) ? data.categories : [] });
        } catch (e) {
          console.error('[store] fetchCategories error:', e);
          set({ categories: [] });
        }
      },

      fetchBrands: async () => {
        try {
          const res = await fetch('/api/brands', { cache: 'no-store' });
          const data: BrandsApiResponse = await res.json();
          set({ brands: data.brands ?? [] });
        } catch (e) {
          console.error('[store] fetchBrands error:', e);
        }
      },

      fetchOrders: async () => {
        try {
          const res = await fetch('/api/orders', { cache: 'no-store' });
          const data: OrdersApiResponse = await res.json();
          set({ orders: data.orders ?? [] });
        } catch (e) {
          console.error('[store] fetchOrders error:', e);
        }
      },

      fetchVisitors: async () => {
        try {
          const res = await fetch('/api/visitors', { cache: 'no-store' });
          const data: VisitorsApiResponse = await res.json();
          set({ visitors: data.count ?? 0 });
        } catch (e) {
          console.error('[store] fetchVisitors error:', e);
        }
      },

      fetchInstallmentPlans: async () => {
        try {
          const res = await fetch('/api/installment-plans', { cache: 'no-store' });
          const data: InstallmentPlansApiResponse = await res.json();
          set({ installmentPlans: data.plans ?? [] });
        } catch (e) {
          console.error('[store] fetchInstallmentPlans error:', e);
        }
      },

      fetchBanners: async () => {
        try {
          const res = await fetch('/api/banners', { cache: 'no-store' });
          const data: BannersApiResponse = await res.json();
          if (Array.isArray(data.banners)) {
            set({ banners: data.banners });
          } else if (Array.isArray(data)) {
            set({ banners: data });
          }
        } catch (e) {
          console.error('[store] fetchBanners error:', e);
        }
      },

      fetchAll: async () => {
        set({ loading: true });
        await Promise.all([
          get().fetchProducts(),
          get().fetchCategories(),
          get().fetchBrands(),
          get().fetchInstallmentPlans(),
          get().fetchBanners(),
        ]);
        set({ loading: false });
      },

      // ── Setters ──
      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({ categories }),
      setBrands: (brands) => set({ brands }),
      setOrders: (orders) => set({ orders }),
      setVisitors: (visitors) => set({ visitors }),
      setInstallmentPlans: (plans) => set({ installmentPlans: plans }),
      setBanners: (banners) => set({ banners }),
    }),
    {
      name: 'techshop-store',
      partialize: (state): PersistedState => ({
        cart: state.cart,
        favorites: state.favorites,
        lang: state.lang,
        products: state.products,
        categories: state.categories,
        brands: state.brands,
        installmentPlans: state.installmentPlans,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    } as PersistOptions<StoreState, PersistedState>
  )
);
