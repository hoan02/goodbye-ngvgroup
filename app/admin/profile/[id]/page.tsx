import { Suspense } from 'react';
import { getProfileById } from '@/app/actions/profile';
import ProfileEditorClient, { ProfileData } from './ProfileEditorClient';
import { ProfileEditorSkeleton } from '@/components/ProfileEditorSkeleton';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfileEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let profile = null;
  
  try {
    profile = await getProfileById(id) as ProfileData;
  } catch (error) {
    console.error(error);
  }

  if (!profile) {
    notFound();
  }

  return (
    <Suspense fallback={<ProfileEditorSkeleton />}>
      <ProfileEditorClient initialProfile={profile} />
    </Suspense>
  );
}
