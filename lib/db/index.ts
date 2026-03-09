import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

if (fs.existsSync(path.join(process.cwd(), ".env.local"))) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

export const db = drizzle(pool, { schema });
