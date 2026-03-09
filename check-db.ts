import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

if (fs.existsSync(path.join(process.cwd(), ".env.local"))) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function check() {
  try {
    const result = await db.execute(sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`);
    console.log("Tables in public schema:", JSON.stringify(result.rows, null, 2));
    const searchPath = await db.execute(sql`SHOW search_path`);
    console.log("Search path:", JSON.stringify(searchPath.rows, null, 2));
    const currentUser = await db.execute(sql`SELECT current_user, current_schema()`);
    console.log("Current user and schema:", JSON.stringify(currentUser.rows, null, 2));
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    process.exit(0);
  }
}

check().catch(console.error);
