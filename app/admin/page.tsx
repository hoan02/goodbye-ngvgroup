import { getAllProfiles } from '@/app/actions/profile';
import DashboardClient from './DashboardClient';
import { Suspense } from 'react';
import { DashboardSkeleton } from '@/components/DashboardSkeleton';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const profiles = await getAllProfiles();
  
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient initialProfiles={profiles} />
    </Suspense>
  );
}
