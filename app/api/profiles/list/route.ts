import { db } from "@/lib/db";
import { profiles, sections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const allProfiles = await db.select().from(profiles);
    return NextResponse.json(allProfiles);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const [newProfile] = await db.insert(profiles).values(body).returning();
    return NextResponse.json(newProfile);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
