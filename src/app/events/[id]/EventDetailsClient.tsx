'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { EventItem, Attendee } from '@/types';
import { eventsAPI, rsvpAPI } from '@/lib/api';
import { EventDetailsSkeleton } from '@/components/common/LoadingSkeleton';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Share2,
  Download,
  ArrowLeft,
  Tag,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Heart,
} from 'lucide-react';
import { toast } from 'sonner';

export default function EventDetailsClient({ id }: { id: string }) {
  const { user } = useAuth();
  const router = useRouter();

  const [event, setEvent] = useState<EventItem | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        setLoading(true);
        const res = await eventsAPI.getById(id);
        if (res.success && res.event) {
          setEvent(res.event);
          setHasJoined(res.hasJoined);
          setAttendees(res.attendees || []);
        }
      } catch (err: any) {
        toast.error('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [id, user]);

  const handleJoinEvent = async () => {
    if (!user) {
      toast.info('Please log in to join this community event!');
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    try {
      setActionLoading(true);
      const res = await rsvpAPI.join(id);
      if (res.success) {
        setHasJoined(true);
        setEvent((prev) => (prev ? { ...prev, attendeesCount: res.attendeesCount } : null));

        setAttendees((prev) => [
          {
            userName: user.name,
            userPhoto: user.photoURL,
            userEmail: user.email,
            joinedAt: new Date().toISOString(),
          },
          ...prev,
        ]);

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#14b8a6', '#6366f1'],
        });

        toast.success(res.message || 'You have successfully joined this event! See you there!');
      } else {
        toast.error(res.message || 'Failed to join event.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not join event.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!confirm('Are you sure you want to cancel your RSVP for this event?')) {
      return;
    }

    try {
      setActionLoading(true);
      const res = await rsvpAPI.leave(id);
      if (res.success) {
        setHasJoined(false);
        setEvent((prev) => (prev ? { ...prev, attendeesCount: res.attendeesCount } : null));
        setAttendees((prev) => prev.filter((a) => a.userEmail !== user?.email));
        toast.info('You have canceled your RSVP.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error canceling RSVP.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied to clipboard! Share with your friends.');
    }
  };

  const handleDownloadICS = () => {
    if (!event) return;
    const startDate = new Date(event.eventDate);
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

    const formatICSDate = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CivicPulse//Social Events//EN',
      'BEGIN:VEVENT',
      `UID:${event._id}@civicpulse.org`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description.replace(/\n/g, ' ')}`,
      `LOCATION:${event.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Calendar event (.ics) downloaded!');
  };

  if (loading) {
    return <EventDetailsSkeleton />;
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Event Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          The event you are looking for may have been removed or does not exist.
        </p>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Upcoming Events</span>
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = new Date(event.eventDate).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back Breadcrumb */}
      <div>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Upcoming Events</span>
        </Link>
      </div>

      {/* Hero Banner Image */}
      <div className="relative w-full h-72 sm:h-96 lg:h-[450px] rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800" style={{ position: 'relative', width: '100%', minHeight: '18rem', maxHeight: '450px' }}>
        <Image
          src={event.thumbnail}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-black/30 to-transparent" />

        {/* Floating Badges */}
        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 dark:bg-gray-900/90 text-emerald-700 dark:text-emerald-400 backdrop-blur-md shadow-md border border-white/20">
            {event.eventType}
          </span>
        </div>

        {/* Title & Location Overlay */}
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-200">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Description + Action Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Event Overview */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">About This Initiative</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Volunteer Guidelines & What to Bring
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Comfortable clothing and closed-toe footwear suitable for outdoor field coordination.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Bring your reusable water bottle to reduce single-use plastic waste on-site.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>All event materials (jackets, blankets, saplings, gloves, and bins) are provided by the organizers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Please arrive 15 minutes before the start time for the team safety briefing and zone assignments.</span>
              </li>
            </ul>
          </div>

          {/* Recent Attendees Showcase */}
          <div className="p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Joined Volunteers ({event.attendeesCount})
              </h3>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Target: {event.targetVolunteers} volunteers
              </span>
            </div>

            {attendees.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 py-2">
                Be the very first community volunteer to sign up for this event!
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {attendees.map((attendee, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800"
                  >
                    <Image
                      src={attendee.userPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                      alt={attendee.userName}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                      style={{ width: '32px', height: '32px', borderRadius: '9999px', objectFit: 'cover' }}
                      unoptimized
                    />
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                      {attendee.userName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Sticky RSVP & Action Card */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Participation</p>
                <p className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {event.attendeesCount} / {event.targetVolunteers}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-gray-900 dark:text-white">Date & Time</span>
                  <span>{formattedDate} at {formattedTime}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-gray-900 dark:text-white">Meeting Point</span>
                  <span>{event.location}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Tag className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block text-gray-900 dark:text-white">Event Type</span>
                  <span>{event.eventType}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {hasJoined ? (
                <div className="space-y-2">
                  <div className="w-full py-3 px-4 rounded-xl text-center bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>RSVP Confirmed — You are attending!</span>
                  </div>
                  <button
                    onClick={handleLeaveEvent}
                    disabled={actionLoading}
                    className="w-full py-2 px-3 text-xs text-red-600 dark:text-red-400 hover:underline text-center cursor-pointer"
                  >
                    {actionLoading ? 'Updating...' : 'Cancel my participation'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleJoinEvent}
                  disabled={actionLoading}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Join This Event</span>
                    </>
                  )}
                </button>
              )}

              {!user && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
                  * Anyone can view this page. To join the event,{' '}
                  <Link href={`/login?redirect=/events/${id}`} className="text-emerald-600 font-semibold underline">
                    login is required
                  </Link>.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 grid grid-cols-2 gap-2">
              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
              <button
                onClick={handleDownloadICS}
                className="py-2.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Initiative Organizer
            </h4>
            <div className="flex items-center gap-3">
              <Image
                src={event.creatorPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                alt={event.creatorName}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover shrink-0"
                style={{ width: '48px', height: '48px', borderRadius: '9999px', objectFit: 'cover' }}
                unoptimized
              />
              <div className="truncate">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                  {event.creatorName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {event.creatorEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
