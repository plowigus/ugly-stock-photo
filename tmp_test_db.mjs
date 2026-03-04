
import { db } from './lib/db';
import { works } from './lib/schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testConnection() {
    try {
        console.log('Testing connection to DATABASE_URL:', process.env.DATABASE_URL?.split('@')[1]); // Log host only for safety
        const result = await db.select().from(works);
        console.log('Works found:', result.length);
        console.log('Data:', JSON.stringify(result, null, 2));
    } catch (e) {
        console.error('Connection/Query Error:', e);
    }
    process.exit(0);
}

testConnection();
