'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { RSVPItem } from '@/types';
import { rsvpAPI } from '@/lib/api';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { EventCardSkeleton } from '@/components/common/LoadingSkeleton';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  Tag,
  ArrowRight,
  XCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function JoinedEventsPage() {
  const { user } = useAuth();
  const [joinedList, setJoinedList] = useState<RSVPItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJoined = async () => {
    try {
      setLoading(true);
      const res = await rsvpAPI.getMyJoined();
      if (res.success && res.joinedEvents) {
        setJoinedList(res.joinedEvents);
      }
    } catch (err: any) {
      toast.error('Failed to load your joined events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchJoined();
    }
  }, [user]);

  const handleCancelRsvp = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to cancel your participation for "${title}"?`)) {
      return;
    }

    try {
      const res = await rsvpAPI.leave(eventId);
      if (res.success) {
        toast.info(`RSVP canceled for ${title}`);
        setJoinedList((prev) =>
          prev.filter((item) => {
            const id = typeof item.eventId === 'string' ? item.eventId : (item.eventId as any)?._id || item._id;
            return id !== eventId && item.eventId !== eventId;
          })
        );
      } else {
        toast.error(res.message || 'Failed to cancel RSVP.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error canceling RSVP.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        
        {/* Header Banner */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-800 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Volunteer Commitment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Joined Community Events
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            A chronological timeline of all social service initiatives and community drives you have pledged to join, sorted by event date.
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <EventCardSkeleton key={n} />
            ))}
          </div>
        ) : joinedList.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900/50 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-gray-400 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">You haven&apos;t joined any events yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Ready to give back to your neighborhood? Explore upcoming drives for winter clothes, cleanliness, and tree planting.
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow"
            >
              <span>Explore Upcoming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedList.map((rsvp) => {
              const eventId = typeof rsvp.eventId === 'string' ? rsvp.eventId : (rsvp.eventId as any)?._id;
              const formattedDate = new Date(rsvp.eventDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={rsvp._id}
                  className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden flex flex-col justify-between h-[420px] hover:shadow-lg transition-all"
                >
                  <div className="relative h-44 w-full bg-gray-100 dark:bg-gray-800" style={{ position: 'relative', width: '100%', height: '11rem' }}>
                    <Image
                      src={rsvp.eventThumbnail}
                      alt={rsvp.eventTitle}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
                        {rsvp.eventType}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-emerald-700 dark:text-emerald-400 backdrop-blur-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        RSVP Confirmed
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{formattedDate}</span>
                      </div>

                      <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2">
                        {rsvp.eventTitle}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate">{rsvp.eventLocation}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleCancelRsvp(eventId, rsvp.eventTitle)}
                        className="text-xs text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel RSVP</span>
                      </button>

                      <Link
                        href={`/events/${eventId}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
                      >
                        <span>View Details</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
