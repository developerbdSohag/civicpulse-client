'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { eventsAPI } from '@/lib/api';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  Type,
  FileText,
  Tag,
  Users,
  PlusCircle,
  Loader2,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import SafeImage from '@/components/common/SafeImage';
import UserAvatar from '@/components/common/UserAvatar';
import { toast } from 'sonner';
import { saveCommunityEvent } from '@/lib/communityEvents';

const EVENT_TYPES = [
  'Donation',
  'Cleanup',
  'Plantation',
  'Healthcare',
  'Education',
  'Relief Aid',
  'Winter Drive',
  'Food Aid',
  'Other',
];

const PRESET_THUMBNAILS = [
  {
    name: 'Winter Clothes',
    url: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Blanket Distribution',
    url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Hatirjheel Cleanup',
    url: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Tree Plantation',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Free Medical Camp',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Book & Education Aid',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventType, setEventType] = useState('Donation');
  const [thumbnail, setThumbnail] = useState(PRESET_THUMBNAILS[0].url);
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('success');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [targetVolunteers, setTargetVolunteers] = useState('50');
  const [submitting, setSubmitting] = useState(false);

  const [minDateString, setMinDateString] = useState('');

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setMinDateString(now.toISOString().slice(0, 16));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.length < 5) {
      toast.error('Title must be at least 5 characters long.');
      return;
    }

    if (!description.trim() || description.length < 15) {
      toast.error('Please provide a descriptive event overview (at least 15 characters).');
      return;
    }

    if (!thumbnail.trim()) {
      toast.error('Please provide a thumbnail image URL or select a preset.');
      return;
    }

    if (!location.trim()) {
      toast.error('Please enter the event meeting location.');
      return;
    }

    if (!eventDate) {
      toast.error('Please select an event date and time.');
      return;
    }

    // Strict Future Date Validation
    const chosenDate = new Date(eventDate);
    if (isNaN(chosenDate.getTime())) {
      toast.error('Invalid event date format.');
      return;
    }

    if (chosenDate <= new Date()) {
      toast.error('Event date must be in the future. Past dates cannot be added.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await eventsAPI.create({
        title: title.trim(),
        description: description.trim(),
        eventType,
        thumbnail: thumbnail.trim(),
        location: location.trim(),
        eventDate: chosenDate.toISOString(),
        targetVolunteers: parseInt(targetVolunteers, 10) || 50,
      });

      if (res.success) {
        if (res.event) {
          saveCommunityEvent(res.event);
        }
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#3b82f6', '#f59e0b'],
        });

        toast.success(res.message || 'Social development event created successfully!');
        // Redirect to Upcoming Events as specified in requirements
        router.push('/events');
      } else {
        toast.error(res.message || 'Failed to create event.');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while creating the event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="space-y-8 bg-white dark:bg-gray-900 p-6 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
          
          {/* Header */}
          <div className="space-y-2 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Organizer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Host a Community Service Event
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Publish an initiative in your neighborhood. Gather volunteers for winter clothing aid, lake cleanups, or healthcare drives.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Type className="w-4 h-4 text-emerald-600" />
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Event Type & Target Volunteers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  Event Type (Dropdown) *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Target Volunteer Headcount
                </label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={targetVolunteers}
                  onChange={(e) => setTargetVolunteers(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Location & Future Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Meeting Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Mohammadpur Town Hall Ground, Dhaka"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Event Date & Time (Future Only) *
                </label>
                <input
                  type="datetime-local"
                  min={minDateString}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                  ✓ Protected: No past dates can be scheduled.
                </p>
              </div>
            </div>

            {/* Thumbnail URL with Preset Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  Thumbnail Image URL *
                </span>
                <span className="text-[11px] text-gray-400 font-normal">
                  Direct image link (.jpg, .png, .webp, or Unsplash)
                </span>
              </label>
              
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => {
                  setThumbnail(e.target.value);
                  setImageStatus('loading');
                }}
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />

              {/* Status Indicator */}
              {imageStatus === 'error' && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Notice: The URL entered is not a direct image file or blocks external embedding.</p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400/90 leading-relaxed">
                      Tip: If copying from photo websites (like Freepik, Magnific, or Unsplash), right-click the photo itself and choose <strong>&ldquo;Copy Image Address&rdquo;</strong> (so the link ends in .jpg, .png, or .webp), rather than copying the browser address bar.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setThumbnail(PRESET_THUMBNAILS[0].url);
                        setImageStatus('success');
                      }}
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline pt-0.5 cursor-pointer"
                    >
                      Use verified high-resolution photo preset &rarr;
                    </button>
                  </div>
                </div>
              )}

              {imageStatus === 'success' && thumbnail && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Image verified &amp; loaded smoothly.</span>
                </p>
              )}

              {/* Preset Thumbnails Picker */}
              <div>
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Or select a verified high-resolution photograph:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_THUMBNAILS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setThumbnail(preset.url);
                        setImageStatus('success');
                      }}
                      className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        thumbnail === preset.url
                          ? 'border-emerald-500 scale-95 shadow-md ring-2 ring-emerald-400/30'
                          : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <SafeImage
                        src={preset.url}
                        alt={preset.name}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Card */}
              {thumbnail && (
                <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 shadow-sm" style={{ position: 'relative', width: '100%', height: '14rem' }}>
                  <SafeImage
                    src={thumbnail}
                    fallbackSrc={PRESET_THUMBNAILS[0].url}
                    alt={title || 'Event preview'}
                    fill
                    onStatusChange={setImageStatus}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${imageStatus === 'error' ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
                    {imageStatus === 'error' ? 'Showing Verified Fallback' : 'Live Preview'}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white pointer-events-none space-y-0.5">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-600/90 text-white backdrop-blur-xs">
                      {eventType}
                    </span>
                    <p className="text-sm sm:text-base font-bold truncate drop-shadow">
                      {title || 'Your Event Title Will Appear Here'}
                    </p>
                    <p className="text-xs text-gray-200 truncate drop-shadow flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      {location || 'Location details'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                Event Description & Volunteer Scope *
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the humanitarian purpose, distribution logistics, volunteer roles, and specific materials to be distributed..."
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            {/* Organizer Note */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <UserAvatar
                src={user?.photoURL}
                name={user?.name}
                size={42}
                className="ring-2 ring-emerald-500/30 shadow-xs shrink-0"
              />
              <div className="text-xs">
                <p className="font-semibold text-gray-900 dark:text-white">
                  Publishing as: {user?.name} ({user?.email})
                </p>
                <p className="text-gray-500 dark:text-gray-400">
                  Your email will be associated with this event so you can manage or edit it anytime.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-magnetic btn-steel-primary py-3.5 px-4 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Community Event</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
