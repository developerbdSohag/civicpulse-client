import React, { Suspense } from 'react';
import EventDetailsClient from './EventDetailsClient';
import { EventDetailsSkeleton } from '@/components/common/LoadingSkeleton';

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <EventDetailsClient id={resolvedParams.id} />
    </Suspense>
  );
}
