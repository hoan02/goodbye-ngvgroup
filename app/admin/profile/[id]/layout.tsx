import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = parseInt(params.id);
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, id),
  });

  if (!profile) {
    return {
      title: "Admin - Profile Not Found",
    };
  }

  return {
    title: `Editing ${profile.name}`,
    description: `Manage the farewell journey of ${profile.name}`,
  };
}

export { default } from "./page";
