import { db } from "@/lib/db";
import { profiles, sections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "ngv-group";

  try {
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.slug, slug),
      with: {
        sections: {
          orderBy: (sections, { asc }) => [asc(sections.order)],
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
