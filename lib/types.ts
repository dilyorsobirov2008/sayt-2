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
  installmentMonths?: number;   // e.g. 12, 18, 24
  discountPercent?: number;     // e.g. 10 = 10% off
  creditMarkupPercent?: number; // kredit uchun foiz ustama, masalan 15 = naqd narxdan 15% qimmat
  storageVariants?: StorageVariant[];
}

export interface StorageVariant {
  id: number;
  ram: number;
  storage: number;
  price: number;
  sku?: string;
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
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedColorPrice?: number;
  selectedVariant?: StorageVariant;
}

export type Language = 'uz' | 'ru';

export interface Review {
  id: string;
  productId: number;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}
