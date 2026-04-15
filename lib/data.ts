import { Category, Product, Banner } from './types';

export const categories: Category[] = [
    { id: 1, slug: 'smartphones', name: "Smartfonlar", nameRu: "Смартфоны", icon: "📱", color: "#3B82F6", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&q=80" },
    { id: 2, slug: 'button-phones', name: "Knopkali telefonlar", nameRu: "Кнопочные телефоны", icon: "☎️", color: "#6366F1", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&q=80" },
    { id: 3, slug: 'laptops', name: "Noutbuklar", nameRu: "Ноутбуки", icon: "💻", color: "#8B5CF6", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80" },
    { id: 4, slug: 'headphones', name: "Naushniklar", nameRu: "Наушники", icon: "🎧", color: "#F59E0B", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&q=80" },
    { id: 5, slug: 'blenders', name: "Blenderlar", nameRu: "Блендеры", icon: "🥤", color: "#10B981", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&q=80" },
    { id: 6, slug: 'juicers', name: "Sharbatsiqgichlar", nameRu: "Соковыжималки", icon: "🍊", color: "#F97316", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&q=80" },
    { id: 7, slug: 'mixers', name: "Mikserlar", nameRu: "Миксеры", icon: "🌀", color: "#EC4899", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80" },
    { id: 8, slug: 'watches', name: "Qo'l soatlar", nameRu: "Часы", icon: "⌚", color: "#14B8A6", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" },
    { id: 9, slug: 'smartwatches', name: "Smartwatchlar", nameRu: "Смарт-часы", icon: "⌚", color: "#EF4444", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80" },
];

export const banners: Banner[] = [
    {
        id: 1,
        title: "Samsung Galaxy S24 Ultra",
        titleRu: "Samsung Galaxy S24 Ultra",
        subtitle: "Eng kuchli smartfon — chegirmada!",
        subtitleRu: "Самый мощный смартфон — со скидкой!",
        bg: "from-yellow-400 to-yellow-600",
        badge: "−30%",
        badgeRu: "−30%",
        link: "/catalog?category=smartphones",
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80"
    },
    {
        id: 2,
        title: "MacBook Pro M3",
        titleRu: "MacBook Pro M3",
        subtitle: "24 oyga muddatli to'lov bilan!",
        subtitleRu: "В рассрочку на 24 месяца!",
        bg: "from-slate-800 to-slate-600",
        badge: "24 oy",
        badgeRu: "24 мес",
        link: "/catalog?category=laptops",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80"
    },
    {
        id: 3,
        title: "Apple Watch Ultra 2",
        titleRu: "Apple Watch Ultra 2",
        subtitle: "Eng zo'r smartwatch — hozir buyurtma bering!",
        subtitleRu: "Лучшие смарт-часы — заказывайте сейчас!",
        bg: "from-gray-900 to-gray-700",
        badge: "Yangi",
        badgeRu: "Новинка",
        link: "/catalog?category=smartwatches",
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80"
    },
];

export const products: Product[] = [
    // Smartfonlar
    {
        id: 1, name: "Samsung Galaxy S24 Ultra", nameRu: "Samsung Galaxy S24 Ultra",
        brand: "Samsung", category: "smartphones", price: 14990000, oldPrice: 17990000,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isNew: true, isFeatured: true, installmentMonths: 24,
        specs: { RAM: "12 GB", Storage: "256 GB", Display: "6.8\"", Battery: "5000 mAh", Camera: "200 MP" }
    },
    {
        id: 2, name: "iPhone 15 Pro Max", nameRu: "iPhone 15 Pro Max",
        brand: "Apple", category: "smartphones", price: 17990000, oldPrice: 19990000,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isFeatured: true, installmentMonths: 24,
        specs: { RAM: "8 GB", Storage: "256 GB", Display: "6.7\"", Battery: "4422 mAh", Camera: "48 MP" }
    },
    {
        id: 3, name: "Xiaomi Mi 11 Ultra", nameRu: "Xiaomi Mi 11 Ultra",
        brand: "Xiaomi", category: "smartphones", price: 8490000, oldPrice: 9990000,
        image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 12,
        specs: { RAM: "12 GB", Storage: "256 GB", Display: "6.81\"", Battery: "5000 mAh" }
    },
    {
        id: 4, name: "Google Pixel 8 Pro", nameRu: "Google Pixel 8 Pro",
        brand: "Google", category: "smartphones", price: 11490000, oldPrice: 12990000,
        image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isNew: true, installmentMonths: 12,
        specs: { RAM: "12 GB", Storage: "128 GB", Camera: "50 MP AI" }
    },

    // Knopkali telefonlar
    {
        id: 5, name: "Nokia 3310 (2017)", nameRu: "Nokia 3310 (2017)",
        brand: "Nokia", category: "button-phones", price: 490000, oldPrice: 590000,
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isFeatured: true, installmentMonths: 3,
        specs: { Battery: "1200 mAh", Display: "2.4\"", Weight: "79.6 g" }
    },
    {
        id: 6, name: "Samsung B310E Guru", nameRu: "Samsung B310E Guru",
        brand: "Samsung", category: "button-phones", price: 290000,
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 3,
        specs: { Battery: "1000 mAh", Display: "2.0\"", SIM: "Dual" }
    },

    // Noutbuklar
    {
        id: 7, name: "MacBook Pro 14\" M3 Pro", nameRu: "MacBook Pro 14\" M3 Pro",
        brand: "Apple", category: "laptops", price: 24990000, oldPrice: 27990000,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isFeatured: true, installmentMonths: 24,
        specs: { CPU: "M3 Pro", RAM: "18 GB", Storage: "512 GB SSD", Display: "14.2\"" }
    },
    {
        id: 8, name: "Dell XPS 15 9530", nameRu: "Dell XPS 15 9530",
        brand: "Dell", category: "laptops", price: 19990000,
        image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 18,
        specs: { CPU: "Intel i9", RAM: "32 GB", Storage: "1 TB SSD", Display: "15.6\" OLED" }
    },
    {
        id: 9, name: "Lenovo ThinkPad X1 Carbon", nameRu: "Lenovo ThinkPad X1 Carbon",
        brand: "Lenovo", category: "laptops", price: 16990000,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 18,
        specs: { CPU: "Intel i7", RAM: "16 GB", Storage: "512 GB", Weight: "1.12 kg" }
    },

    // Naushniklar
    {
        id: 10, name: "Sony WH-1000XM5", nameRu: "Sony WH-1000XM5",
        brand: "Sony", category: "headphones", price: 3990000, oldPrice: 4990000,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isFeatured: true, installmentMonths: 12,
        specs: { Type: "Over-ear", ANC: "Bor", Battery: "30 soat" }
    },
    {
        id: 11, name: "AirPods Pro 2", nameRu: "AirPods Pro 2",
        brand: "Apple", category: "headphones", price: 3490000, oldPrice: 3990000,
        image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 6,
        specs: { ANC: "Bor", Battery: "30 soat (case bilan)", Type: "In-ear" }
    },

    // Blenderlar
    {
        id: 12, name: "Philips HR2221 Blender", nameRu: "Philips HR2221 Блендер",
        brand: "Philips", category: "blenders", price: 890000, oldPrice: 1090000,
        image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isFeatured: true, installmentMonths: 6,
        specs: { Power: "600 W", Volume: "1.5 L", Speed: "2 tezlik" }
    },
    {
        id: 13, name: "Bosch MSM2610B Blender", nameRu: "Bosch MSM2610B Блендер",
        brand: "Bosch", category: "blenders", price: 1190000,
        image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 6,
        specs: { Power: "700 W", Volume: "1.5 L", Blades: "6 ta" }
    },

    // Sharbatsiqgichlar
    {
        id: 14, name: "Philips HR1832 Juicer", nameRu: "Philips HR1832 Соковыжималка",
        brand: "Philips", category: "juicers", price: 790000, oldPrice: 990000,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isFeatured: true, installmentMonths: 6,
        specs: { Power: "400 W", Type: "Tsentrifugali", Capacity: "1 L" }
    },
    {
        id: 15, name: "Kenwood JE290 Juicer", nameRu: "Kenwood JE290 Соковыжималка",
        brand: "Kenwood", category: "juicers", price: 1290000,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 6,
        specs: { Power: "700 W", Pulp: "Yo'q qiladi", Container: "1.2 L" }
    },

    // Mikserlar
    {
        id: 16, name: "Bosch MFQ40302 Mikser", nameRu: "Bosch MFQ40302 Миксер",
        brand: "Bosch", category: "mixers", price: 690000, oldPrice: 890000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isFeatured: true, installmentMonths: 6,
        specs: { Power: "500 W", Speed: "5 tezlik", Type: "Qo'l mikseri" }
    },
    {
        id: 17, name: "KitchenAid Stand Mixer", nameRu: "KitchenAid Стационарный Миксер",
        brand: "KitchenAid", category: "mixers", price: 5990000,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 12,
        specs: { Power: "300 W", Volume: "4.8 L", Speed: "10 tezlik" }
    },

    // Qo'l soatlar
    {
        id: 18, name: "Casio G-Shock GA-2100", nameRu: "Casio G-Shock GA-2100",
        brand: "Casio", category: "watches", price: 1490000, oldPrice: 1790000,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isFeatured: true, installmentMonths: 6,
        specs: { Type: "Analog-Digital", Water: "200 m", Battery: "2 yil" }
    },
    {
        id: 19, name: "Seiko Presage Automatic", nameRu: "Seiko Presage Automatic",
        brand: "Seiko", category: "watches", price: 4990000,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 12,
        specs: { Type: "Mexanik", Water: "50 m", Movement: "Avtomatik" }
    },

    // Smartwatchlar
    {
        id: 20, name: "Apple Watch Ultra 2", nameRu: "Apple Watch Ultra 2",
        brand: "Apple", category: "smartwatches", price: 7990000, oldPrice: 8990000,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isNew: true, isFeatured: true, installmentMonths: 12,
        specs: { Display: "49 mm", Battery: "60 soat", GPS: "Bor", OS: "watchOS" }
    },
    {
        id: 21, name: "Samsung Galaxy Watch 6", nameRu: "Samsung Galaxy Watch 6",
        brand: "Samsung", category: "smartwatches", price: 3990000, oldPrice: 4490000,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, installmentMonths: 12,
        specs: { Display: "44 mm", Battery: "40 soat", GPS: "Bor", OS: "Wear OS" }
    },
    {
        id: 22, name: "Xiaomi Mi Band 8 Pro", nameRu: "Xiaomi Mi Band 8 Pro",
        brand: "Xiaomi", category: "smartwatches", price: 890000, oldPrice: 1090000,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80",
        rating: 0, reviewCount: 0, inStock: true, isNew: true, installmentMonths: 3,
        specs: { Display: "1.74\"", Battery: "14 kun", Steps: "Qadam hisoblash" }
    },
];
