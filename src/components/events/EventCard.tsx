'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import SafeImage from '@/components/common/SafeImage';
import UserAvatar from '@/components/common/UserAvatar';
import Link from 'next/link';
import { EventItem } from '@/types';
import { Calendar, MapPin, Users, ArrowRight, Tag, Sparkles } from 'lucide-react';
import CivicCategoryAnimationModal, { mapEventTypeToCategory } from '@/components/animations/CivicCategoryAnimationModal';

interface EventCardProps {
  event: EventItem;
}

export default function EventCard({ event }: EventCardProps) {
  const [showAnimationModal, setShowAnimationModal] = useState(false);

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Category badge colors
  const typeColors: Record<string, string> = {
    Cleanup: 'bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    Plantation: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Donation: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    Healthcare: 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    Education: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    'Relief Aid': 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    'Winter Drive': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    'Food Aid': 'bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300 border-orange-200 dark:border-orange-800',
  };

  const badgeStyle = typeColors[event.eventType] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';

  return (
    <>
      <article
        onClick={() => setShowAnimationModal(true)}
        className="group flex flex-col justify-between h-[450px] w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Thumbnail Section */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <SafeImage
            src={event.thumbnail}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

          {/* Event Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-sm ${badgeStyle}`}>
              <Tag className="w-3 h-3" />
              {event.eventType}
            </span>
          </div>

          {/* Animated Indicator Hover Badge */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-900/90 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Watch Animation</span>
            </span>
          </div>

          {/* Volunteers Counter Badge */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-black/60 text-white backdrop-blur-md">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              {event.attendeesCount} joined
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2.5">
            {/* Date & Location */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-medium text-emerald-700 dark:text-emerald-400">{formattedDate}</span>
              </div>
              <div className="flex items-center gap-1 truncate max-w-[50%]">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-base font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              {event.title}
            </h3>

            {/* Description Snippet */}
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Card Footer: Organizer & Action Button */}
          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <UserAvatar
                src={event.creatorPhoto}
                name={event.creatorName}
                size={28}
                className="border border-gray-200 dark:border-gray-700"
              />
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {event.creatorName}
              </span>
            </div>

            {/* View Event & Animation Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnimationModal(true);
                }}
                className="btn-magnetic inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 dark:hover:text-white hover:border-emerald-600 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-500 group-hover:text-white" />
                <span>View Event</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Interactive Category Impact Animation Modal for this Event */}
      <CivicCategoryAnimationModal
        isOpen={showAnimationModal}
        onClose={() => setShowAnimationModal(false)}
        initialCategory={mapEventTypeToCategory(event.eventType)}
        eventContext={{
          _id: event._id,
          title: event.title,
          location: event.location,
          eventDate: event.eventDate,
          thumbnail: event.thumbnail,
          eventType: event.eventType,
        }}
      />
    </>
  );
}
