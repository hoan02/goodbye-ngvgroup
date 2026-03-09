import { db } from "@/lib/db";
import { profiles, sections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    const dataPath = path.join(process.cwd(), "data/farewell.json");
    if (!fs.existsSync(dataPath)) {
       return NextResponse.json({ error: "farewell.json not found" }, { status: 404 });
    }
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const existing = await db.select().from(profiles).where(eq(profiles.slug, "ngv-group")).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Initial profile already exists" });
    }

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

    return NextResponse.json({ message: "Seeded successfully", profileId: profile.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
