import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

if (fs.existsSync(path.join(process.cwd(), ".env.local"))) {
  dotenv.config({ path: ".env.local" });
} else {
  dotenv.config();
}
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profiles, sections } from "../lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const connectionString = process.env.DATABASE_URL!;
  const client = postgres(connectionString);
  const db = drizzle(client);

  const dataPath = path.join(process.cwd(), "data/farewell.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  // Check if initial profile already exists
  const existing = await db.select().from(profiles).where(eq(profiles.slug, "ngv-group")).limit(1);
  if (existing.length > 0) {
    console.log("Initial profile already exists. Skipping migration.");
    process.exit(0);
  }

  console.log("Migrating data from farewell.json...");

  const [profile] = await db.insert(profiles).values({
    slug: "ngv-group",
    name: data.company.name,
    role: data.author.role,
    department: data.author.department,
    tagline: data.intro.tagline,
    buttonText: data.intro.buttonText,
    logoUrl: data.intro.logoUrl,
    musicUrl: data.music.url,
    musicTitle: data.music.title,
    bgImageUrl: "/images/Year_End_Party_NGV_Group.jpeg",
  }).returning();

  const sectionsToInsert = data.sections.map((s: any, index: number) => ({
    profileId: profile.id,
    title: s.title,
    type: s.content ? 'text' : (s.credits ? 'credits' : (s.memories ? 'memories' : (s.achievements ? 'achievements' : (s.message ? 'text' : (s.closing ? 'text' : 'list'))))),
    content: s.content || s.message || s.closing || null,
    items: s.credits || s.memories || s.achievements || null,
    order: index,
  }));

  await db.insert(sections).values(sectionsToInsert);

  console.log("Migration completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
