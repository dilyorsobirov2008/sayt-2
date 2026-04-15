const { Pool } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function checkTables() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error('DATABASE_URL is missing');
        return;
    }

    const pool = new Pool({ connectionString });
    try {
        const client = await pool.connect();
        console.log('✅ Connected successfully!');
        const res = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        console.log('Tables in database:', res.rows.map(r => r.table_name));
        client.release();
    } catch (err) {
        console.error('❌ Error checking tables:', err.message);
    } finally {
        await pool.end();
    }
}

checkTables();
