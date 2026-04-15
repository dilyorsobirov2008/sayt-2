const { Pool } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkData() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    try {
        const client = await pool.connect();
        const cats = await client.query('SELECT count(*) FROM "Category"');
        const prods = await client.query('SELECT count(*) FROM "Product"');
        const brands = await client.query('SELECT count(*) FROM "Brand"');
        console.log('Category count:', cats.rows[0].count);
        console.log('Product count:', prods.rows[0].count);
        console.log('Brand count:', brands.rows[0].count);
        client.release();
    } catch (err) {
        console.error('❌ Error checking data:', err.message);
    } finally {
        await pool.end();
    }
}

checkData();
