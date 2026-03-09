import { db } from "@/lib/db";
import { profiles, sections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const { id, name, role, department, tagline, buttonText, musicUrl, musicTitle, sections: updatedSections } = await request.json();

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    // Update profile
    await db.update(profiles)
      .set({ name, role, department, tagline, buttonText, musicUrl, musicTitle, updatedAt: new Date() })
      .where(eq(profiles.id, id));

    // Simple section update logic (for MVP: delete and re-insert or update by ID)
    if (updatedSections && Array.isArray(updatedSections)) {
      for (const section of updatedSections) {
        if (section.id) {
          await db.update(sections)
            .set({ 
              title: section.title, 
              content: section.content, 
              items: section.items,
              order: section.order 
            })
            .where(eq(sections.id, section.id));
        } else {
          await db.insert(sections).values({
            profileId: id,
            title: section.title,
            type: section.type || 'text',
            content: section.content,
            items: section.items,
            order: section.order || 0
          });
        }
      }
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  try {
    await db.delete(profiles).where(eq(profiles.id, parseInt(id)));
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
