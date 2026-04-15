import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        // Clear existing data
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.brand.deleteMany();

        // Categories
        const categories = [
            { slug: 'smartphones', name: "Smartfonlar", nameRu: "Смартфоны", icon: "📱", color: "#3B82F6", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&q=80" },
            { slug: 'button-phones', name: "Knopkali telefonlar", nameRu: "Кнопочные телефоны", icon: "☎️", color: "#6366F1", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&q=80" },
            { slug: 'laptops', name: "Noutbuklar", nameRu: "Ноутбуки", icon: "💻", color: "#8B5CF6", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80" },
            { slug: 'headphones', name: "Naushniklar", nameRu: "Наушники", icon: "🎧", color: "#F59E0B", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&q=80" },
            { slug: 'blenders', name: "Blenderlar", nameRu: "Блендеры", icon: "🥤", color: "#10B981", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&q=80" },
            { slug: 'juicers', name: "Sharbatsiqgichlar", nameRu: "Соковыжималки", icon: "🍊", color: "#F97316", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&q=80" },
            { slug: 'mixers', name: "Mikserlar", nameRu: "Миксеры", icon: "🌀", color: "#EC4899", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80" },
            { slug: 'watches', name: "Qo'l soatlar", nameRu: "Часы", icon: "⌚", color: "#14B8A6", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" },
            { slug: 'smartwatches', name: "Smartwatchlar", nameRu: "Смарт-часы", icon: "⌚", color: "#EF4444", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80" },
        ];
        for (const cat of categories) {
            await prisma.category.create({ data: cat });
        }

        // Brands
        const brands = [
            { name: 'Apple', slug: 'apple' }, { name: 'Samsung', slug: 'samsung' },
            { name: 'Xiaomi', slug: 'xiaomi' }, { name: 'Google', slug: 'google' },
            { name: 'Nokia', slug: 'nokia' }, { name: 'Dell', slug: 'dell' },
            { name: 'Lenovo', slug: 'lenovo' }, { name: 'Sony', slug: 'sony' },
            { name: 'Philips', slug: 'philips' }, { name: 'Bosch', slug: 'bosch' },
            { name: 'Artel', slug: 'artel' }, { name: 'Huawei', slug: 'huawei' },
            { name: 'Casio', slug: 'casio' }, { name: 'Seiko', slug: 'seiko' },
            { name: 'Kenwood', slug: 'kenwood' }, { name: 'KitchenAid', slug: 'kitchenaid' },
        ];
        for (const brand of brands) {
            await prisma.brand.create({ data: brand });
        }

        // Products — oldPrice olib tashlandi (schema'da yo'q), categorySlug → category_name
        const products = [
            { name: "Samsung Galaxy S24 Ultra", nameRu: "Samsung Galaxy S24 Ultra", brand: "Samsung", category_name: "Smartfonlar", categorySlug: "smartphones", price: 14990000, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80", inStock: true, isNew: true, isFeatured: true, installmentMonths: 24, discountPercent: 17, specs: JSON.stringify({ RAM: "12 GB", Storage: "256 GB", Display: '6.8"', Battery: "5000 mAh", Camera: "200 MP" }) },
            { name: "iPhone 15 Pro Max", nameRu: "iPhone 15 Pro Max", brand: "Apple", category_name: "Smartfonlar", categorySlug: "smartphones", price: 17990000, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80", inStock: true, isFeatured: true, installmentMonths: 24, discountPercent: 10, specs: JSON.stringify({ RAM: "8 GB", Storage: "256 GB", Display: '6.7"', Battery: "4422 mAh", Camera: "48 MP" }) },
            { name: "Xiaomi Mi 11 Ultra", nameRu: "Xiaomi Mi 11 Ultra", brand: "Xiaomi", category_name: "Smartfonlar", categorySlug: "smartphones", price: 8490000, image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&q=80", inStock: true, installmentMonths: 12, discountPercent: 15, specs: JSON.stringify({ RAM: "12 GB", Storage: "256 GB", Display: '6.81"', Battery: "5000 mAh" }) },
            { name: "Google Pixel 8 Pro", nameRu: "Google Pixel 8 Pro", brand: "Google", category_name: "Smartfonlar", categorySlug: "smartphones", price: 11490000, image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80", inStock: true, isNew: true, installmentMonths: 12, discountPercent: 12, specs: JSON.stringify({ RAM: "12 GB", Storage: "128 GB", Camera: "50 MP AI" }) },
            { name: "Nokia 3310 (2017)", nameRu: "Nokia 3310 (2017)", brand: "Nokia", category_name: "Knopkali telefonlar", categorySlug: "button-phones", price: 490000, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80", inStock: true, isFeatured: true, installmentMonths: 3, discountPercent: 17, specs: JSON.stringify({ Battery: "1200 mAh", Display: '2.4"', Weight: "79.6 g" }) },
            { name: "Samsung B310E Guru", nameRu: "Samsung B310E Guru", brand: "Samsung", category_name: "Knopkali telefonlar", categorySlug: "button-phones", price: 290000, image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80", inStock: true, installmentMonths: 3, specs: JSON.stringify({ Battery: "1000 mAh", Display: '2.0"', SIM: "Dual" }) },
            { name: 'MacBook Pro 14" M3 Pro', nameRu: 'MacBook Pro 14" M3 Pro', brand: "Apple", category_name: "Noutbuklar", categorySlug: "laptops", price: 24990000, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", inStock: true, isFeatured: true, installmentMonths: 24, discountPercent: 11, specs: JSON.stringify({ CPU: "M3 Pro", RAM: "18 GB", Storage: "512 GB SSD", Display: '14.2"' }) },
            { name: "Dell XPS 15 9530", nameRu: "Dell XPS 15 9530", brand: "Dell", category_name: "Noutbuklar", categorySlug: "laptops", price: 19990000, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", inStock: true, installmentMonths: 18, specs: JSON.stringify({ CPU: "Intel i9", RAM: "32 GB", Storage: "1 TB SSD", Display: '15.6" OLED' }) },
            { name: "Lenovo ThinkPad X1 Carbon", nameRu: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", category_name: "Noutbuklar", categorySlug: "laptops", price: 16990000, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80", inStock: true, installmentMonths: 18, specs: JSON.stringify({ CPU: "Intel i7", RAM: "16 GB", Storage: "512 GB", Weight: "1.12 kg" }) },
            { name: "Sony WH-1000XM5", nameRu: "Sony WH-1000XM5", brand: "Sony", category_name: "Naushniklar", categorySlug: "headphones", price: 3990000, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80", inStock: true, isFeatured: true, installmentMonths: 12, discountPercent: 20, specs: JSON.stringify({ Type: "Over-ear", ANC: "Bor", Battery: "30 soat" }) },
            { name: "AirPods Pro 2", nameRu: "AirPods Pro 2", brand: "Apple", category_name: "Naushniklar", categorySlug: "headphones", price: 3490000, image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80", inStock: true, installmentMonths: 6, discountPercent: 13, specs: JSON.stringify({ ANC: "Bor", Battery: "30 soat (case bilan)", Type: "In-ear" }) },
            { name: "Philips HR2221 Blender", nameRu: "Philips HR2221 Блендер", brand: "Philips", category_name: "Blenderlar", categorySlug: "blenders", price: 890000, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80", inStock: true, isFeatured: true, installmentMonths: 6, discountPercent: 18, specs: JSON.stringify({ Power: "600 W", Volume: "1.5 L", Speed: "2 tezlik" }) },
            { name: "Bosch MSM2610B Blender", nameRu: "Bosch MSM2610B Блендер", brand: "Bosch", category_name: "Blenderlar", categorySlug: "blenders", price: 1190000, image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&q=80", inStock: true, installmentMonths: 6, specs: JSON.stringify({ Power: "700 W", Volume: "1.5 L", Blades: "6 ta" }) },
            { name: "Philips HR1832 Juicer", nameRu: "Philips HR1832 Соковыжималка", brand: "Philips", category_name: "Sharbatsiqgichlar", categorySlug: "juicers", price: 790000, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80", inStock: true, isFeatured: true, installmentMonths: 6, discountPercent: 20, specs: JSON.stringify({ Power: "400 W", Type: "Tsentrifugali", Capacity: "1 L" }) },
            { name: "Kenwood JE290 Juicer", nameRu: "Kenwood JE290 Соковыжималка", brand: "Kenwood", category_name: "Sharbatsiqgichlar", categorySlug: "juicers", price: 1290000, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80", inStock: true, installmentMonths: 6, specs: JSON.stringify({ Power: "700 W", Pulp: "Yo'q qiladi", Container: "1.2 L" }) },
            { name: "Bosch MFQ40302 Mikser", nameRu: "Bosch MFQ40302 Миксер", brand: "Bosch", category_name: "Mikserlar", categorySlug: "mixers", price: 690000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80", inStock: true, isFeatured: true, installmentMonths: 6, discountPercent: 22, specs: JSON.stringify({ Power: "500 W", Speed: "5 tezlik", Type: "Qo'l mikseri" }) },
            { name: "KitchenAid Stand Mixer", nameRu: "KitchenAid Стационарный Миксер", brand: "KitchenAid", category_name: "Mikserlar", categorySlug: "mixers", price: 5990000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80", inStock: true, installmentMonths: 12, specs: JSON.stringify({ Power: "300 W", Volume: "4.8 L", Speed: "10 tezlik" }) },
            { name: "Casio G-Shock GA-2100", nameRu: "Casio G-Shock GA-2100", brand: "Casio", category_name: "Qo'l soatlar", categorySlug: "watches", price: 1490000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", inStock: true, isFeatured: true, installmentMonths: 6, discountPercent: 17, specs: JSON.stringify({ Type: "Analog-Digital", Water: "200 m", Battery: "2 yil" }) },
            { name: "Seiko Presage Automatic", nameRu: "Seiko Presage Automatic", brand: "Seiko", category_name: "Qo'l soatlar", categorySlug: "watches", price: 4990000, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", inStock: true, installmentMonths: 12, specs: JSON.stringify({ Type: "Mexanik", Water: "50 m", Movement: "Avtomatik" }) },
            { name: "Apple Watch Ultra 2", nameRu: "Apple Watch Ultra 2", brand: "Apple", category_name: "Smartwatchlar", categorySlug: "smartwatches", price: 7990000, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80", inStock: true, isNew: true, isFeatured: true, installmentMonths: 12, discountPercent: 11, specs: JSON.stringify({ Display: "49 mm", Battery: "60 soat", GPS: "Bor", OS: "watchOS" }) },
            { name: "Samsung Galaxy Watch 6", nameRu: "Samsung Galaxy Watch 6", brand: "Samsung", category_name: "Smartwatchlar", categorySlug: "smartwatches", price: 3990000, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80", inStock: true, installmentMonths: 12, discountPercent: 11, specs: JSON.stringify({ Display: "44 mm", Battery: "40 soat", GPS: "Bor", OS: "Wear OS" }) },
            { name: "Xiaomi Mi Band 8 Pro", nameRu: "Xiaomi Mi Band 8 Pro", brand: "Xiaomi", category_name: "Smartwatchlar", categorySlug: "smartwatches", price: 890000, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80", inStock: true, isNew: true, installmentMonths: 3, discountPercent: 18, specs: JSON.stringify({ Display: '1.74"', Battery: "14 kun", Steps: "Qadam hisoblash" }) },
        ];
        for (const prod of products) {
            await prisma.product.create({ data: prod });
        }

        return NextResponse.json({ success: true, categories: categories.length, brands: brands.length, products: products.length });
    } catch (err) {
        console.error('Seed error:', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
