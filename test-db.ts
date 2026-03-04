import { db } from "./lib/db";
import { works } from "./lib/schema";

async function test() {
    try {
        console.log("Connecting to database...");
        const result = await db.select().from(works);
        console.log(`Successfully fetched ${result.length} works.`);
        console.log("Data sample:", JSON.stringify(result.slice(0, 2), null, 2));
    } catch (error) {
        console.error("Database connection failed:", error);
    }
}

test();
