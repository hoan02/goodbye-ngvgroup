import * as dotenv from "dotenv";
dotenv.config();

import { db } from "./lib/db";
import { sql } from "drizzle-orm";

async function check() {
  try {
    const result = await db.execute(sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'`);
    console.log("Tables in database:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    process.exit(0);
  }
}

check().catch(console.error);
