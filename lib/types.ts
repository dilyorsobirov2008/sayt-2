// ─── Domain Models ────────────────────────────────────────────────────────────

export interface StorageVariant {
  id: number;
  productId?: number;
  ram: number;
  storage: number;
  price: number;
  sku?: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  color: string;
  colorName: string;
  colorNameRu?: string;
  image?: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  nameRu: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specs?: Record<string, string>;
  isNew?: boolean;
  isFeatured?: boolean;
  installmentMonths?: number;
  discountPercent?: number;
  creditMarkupPercent?: number;
  storageVariants?: StorageVariant[];
  variants?: ProductVariant[];
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  nameRu: string;
  icon: string;
  color: string;
  image: string;
}

export interface Banner {
  id: number;
  title: string;
  titleRu: string;
  subtitle: string;
  subtitleRu: string;
  bg: string;
  badge: string;
  badgeRu: string;
  link: string;
  image: string;
  type?: 'slider' | 'promo';
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Review {
  id: string;
  productId: number;
  userId?: number;
  userName: string;
  rating: number; // 1–5
  comment: string;
  date: string;
}

export interface InstallmentPlan {
  id: number;
  months: number;
  interestPercent: number;
  isActive: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface SelectedColorObj {
  colorName: string;
  color: string;
  price?: number;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedColorPrice?: number;
  selectedVariant?: StorageVariant;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'cash' | 'credit';
export type OrderStatus = 'new' | 'processing' | 'delivering' | 'delivered' | 'cancelled';


export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  cashPrice?: number;
}

export interface OrderLocation {
  lat: string;
  lng: string;
  text: string;
}

export interface Order {
  id: string;
  customer: string;
  phone: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string;
  address?: string;
  installment?: number;
  paymentMethod: PaymentMethod;
  telegramSent: boolean;
  createdAt?: string;
}

// ─── API Request / Response shapes ────────────────────────────────────────────

export interface CreateOrderRequest {
  userId: string | null;
  customer: string;
  phone: string;
  product: string;
  amount: number;
  status: OrderStatus;
  date: string;
  address: string;
  installment: number;
  paymentMethod: PaymentMethod;
  telegramSent: boolean;
}

export interface CreateOrderResponse {
  success: boolean;
  order?: Order;
  error?: string;
}

export interface TelegramOrderRequest {
  name: string;
  surname: string;
  phone: string;
  location: OrderLocation;
  items: OrderItem[];
  total: number;
  cashTotal: number;
  creditTotal: number;
  chatId: string;
  paymentMethod: PaymentMethod;
  installmentMonths: number;
  interestPercent: number;
}

export interface TelegramOrderResponse {
  success: boolean;
  error?: string;
  errors?: string[];
}

export interface TelegramApiResponse {
  ok: boolean;
  result?: unknown;
  description?: string;
  error_code?: number;
}

export interface TelegramInlineButton {
  text: string;
  url: string;
}

// ─── API list responses ────────────────────────────────────────────────────────

export interface ProductsApiResponse {
  products: Product[];
  error?: string;
}

export interface CategoriesApiResponse {
  categories: Category[];
  error?: string;
}

export interface BrandsApiResponse {
  brands: Brand[];
  error?: string;
}

export interface OrdersApiResponse {
  orders: Order[];
  error?: string;
}

export interface BannersApiResponse {
  banners: Banner[];
  error?: string;
}

export interface InstallmentPlansApiResponse {
  plans: InstallmentPlan[];
  error?: string;
}

export interface VisitorsApiResponse {
  count: number;
  error?: string;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

// ─── i18n ─────────────────────────────────────────────────────────────────────

export type Language = 'uz' | 'ru';
