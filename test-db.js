const { Pool } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function testConnection() {
    const connectionString = process.env.DATABASE_URL;
    console.log('Testing connection with:', connectionString ? connectionString.substring(0, 20) + '...' : 'UNDEFINED');
    
    if (!connectionString) {
        console.error('DATABASE_URL is missing');
        return;
    }

    const pool = new Pool({ connectionString });
    try {
        const client = await pool.connect();
        console.log('✅ Connected successfully!');
        const res = await client.query('SELECT NOW()');
        console.log('Query result:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('❌ Connection error:', err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
