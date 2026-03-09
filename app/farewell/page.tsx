import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Metadata } from "next";
import FarewellClient from "./FarewellClient";
import { Suspense } from "react";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const slug = (searchParams.profile as string) || 'ngv-group';
  
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.slug, slug),
  });

  if (!profile) {
    return {
      title: "Farewell - Profile Not Found",
    };
  }

  return {
    title: `Farewell Journey: ${profile.name}`,
    description: profile.tagline || `A cinematic farewell experience for ${profile.name}.`,
    openGraph: {
      title: `${profile.name} - Farewell & Memories`,
      description: profile.tagline || `Ghi lại những khoảnh khắc và lời chúc ý nghĩa của ${profile.name}.`,
      images: profile.avatarUrl ? [{ url: profile.avatarUrl }] : [],
    },
  };
}

export default function FarewellPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-background text-accent animate-pulse text-2xl font-light tracking-widest">
        LOADING...
      </div>
    }>
      <FarewellClient />
    </Suspense>
  );
}
