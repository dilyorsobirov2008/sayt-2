const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        const count = await prisma.product.count();
        console.log('Total products in database: ', count);
        
        const products = await prisma.product.findMany({ take: 2 });
        console.log('Sample products: ', JSON.stringify(products, null, 2));
    } catch (e) {
        console.error('DB Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
