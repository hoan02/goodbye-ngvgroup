import dbConnect from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";
import { Metadata } from "next";
import FarewellClient from "./FarewellClient";
import { Suspense } from "react";
import { getProfileBySlug } from "@/app/actions/profile";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  const searchParams = await props.searchParams;
  const slug = (searchParams.profile as string) || 'ngv-group';
  
  await dbConnect();
  const profile = await Profile.findOne({ slug }).lean();

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

export default async function FarewellPage(props: Props) {
  const searchParams = await props.searchParams;
  const slug = (searchParams.profile as string) || 'ngv-group';
  
  // Create promise on the server side and pass to Client component
  const profilePromise = getProfileBySlug(slug);

  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center bg-background text-accent animate-pulse text-2xl font-light tracking-widest">
        LOADING...
      </div>
    }>
      <FarewellClient profilePromise={profilePromise} />
    </Suspense>
  );
}
