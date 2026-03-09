import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

if (fs.existsSync(path.join(process.cwd(), ".env.local"))) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}

import pg from "pg";
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

async function init() {
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log("Creating tables with pg...");

    const client = await pool.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id SERIAL PRIMARY KEY,
        slug TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        role TEXT,
        department TEXT,
        avatar_url TEXT,
        bg_image_url TEXT DEFAULT '/images/Year_End_Party_NGV_Group.jpeg',
        logo_url TEXT DEFAULT '/logo.png',
        tagline TEXT,
        button_text TEXT DEFAULT 'Bắt Đầu',
        music_url TEXT,
        music_title TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS sections (
        id SERIAL PRIMARY KEY,
        profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT,
        items JSONB,
        "order" INTEGER DEFAULT 0
      )
    `);

    console.log("Tables created successfully.");
    client.release();
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await pool.end();
  }
}

init().catch(console.error);
