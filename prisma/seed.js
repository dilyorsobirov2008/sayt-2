require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// WebSocket is required for Neon serverless driver in Node.js
neonConfig.webSocketConstructor = ws;

async function main() {
    console.log('Seeding database with Neon adapter...');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const categories = [
            { slug: 'smartphones', name: "Smartfonlar", nameRu: "Смартфоны", icon: "📱", color: "#3B82F6", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&q=80" },
            { slug: 'button-phones', name: "Tugmali telefonlar", nameRu: "Кнопочные телефоны", icon: "☎️", color: "#6366F1", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&q=80" },
            { slug: 'laptops', name: "Noutbuklar", nameRu: "Ноутбуки", icon: "💻", color: "#8B5CF6", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&q=80" },
            { slug: 'headphones', name: "Naushniklar", nameRu: "Наушники", icon: "🎧", color: "#F59E0B", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200&q=80" },
            { slug: 'monitors', name: "Monitorlar", nameRu: "Мониторы", icon: "🖥️", color: "#3B82F6", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&q=80" },
            { slug: 'blenders', name: "Blenderlar", nameRu: "Блендеры", icon: "🥤", color: "#10B981", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=200&q=80" },
            { slug: 'watches', name: "Qo'l soatlar", nameRu: "Часы", icon: "⌚", color: "#14B8A6", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80" },
            { slug: 'smartwatches', name: "Smartwatchlar", nameRu: "Смарт-часы", icon: "⌚", color: "#F472B6", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&q=80" },
            { slug: 'accessories', name: "Aksessuarlar", nameRu: "Аксессуары", icon: "🔌", color: "#6B7280", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&q=80" }
        ];

        for (const cat of categories) {
            await prisma.category.upsert({
                where: { slug: cat.slug },
                update: cat,
                create: cat,
            });
        }
        console.log(`✅ ${categories.length} kategoriya tayyorlandi`);

        const brands = ["Samsung", "Apple", "Xiaomi", "Vivo", "Oppo", "Realme", "Artel", "Huawei"];
        for (const name of brands) {
            await prisma.brand.upsert({
                where: { name },
                update: { name, slug: name.toLowerCase() },
                create: { name, slug: name.toLowerCase() },
            });
        }
        console.log(`✅ ${brands.length} brend tayyorlandi`);

        const products = [
            {
                name: "Samsung Galaxy S24 Ultra",
                nameRu: "Samsung Galaxy S24 Ultra",
                brand: "Samsung",
                categorySlug: "smartphones",
                price: 15600000,
                oldPrice: 17000000,
                image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
                specs: "Snapdragon 8 Gen 3, 12GB RAM, 256GB, 200MP Camera",
                isNew: true,
                isFeatured: true
            },
            {
                name: "iPhone 15 Pro Max",
                nameRu: "iPhone 15 Pro Max",
                brand: "Apple",
                categorySlug: "smartphones",
                price: 16800000,
                oldPrice: 18500000,
                image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400&q=80",
                specs: "A17 Pro, 8GB RAM, 256GB, Titanium Design",
                isFeatured: true
            }
        ];

        for (const p of products) {
            await prisma.product.create({ data: p });
        }
        console.log(`✅ ${products.length} mahsulot qo'shildi`);

        const plans = [
            { months: 3, interestPercent: 0, isActive: true },
            { months: 6, interestPercent: 12, isActive: true },
            { months: 12, interestPercent: 24, isActive: true },
            { months: 24, interestPercent: 40, isActive: true },
        ];

        for (const plan of plans) {
            await prisma.installmentPlan.upsert({
                where: { months: plan.months },
                update: { interestPercent: plan.interestPercent, isActive: plan.isActive },
                create: { months: plan.months, interestPercent: plan.interestPercent, isActive: plan.isActive },
            });
        }
        console.log(`✅ ${plans.length} xil bo'lib to'lash rejalari qo'shildi`);

        console.log('✅ Seed tugadi!');
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:');
        console.error(e);
        process.exit(1);
    });
