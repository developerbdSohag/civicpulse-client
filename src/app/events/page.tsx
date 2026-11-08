'use client';

import React, { useEffect, useState, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EventItem } from '@/types';
import { eventsAPI } from '@/lib/api';
import EventCard from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/common/LoadingSkeleton';
import { Search, Filter, Calendar, MapPin, Sparkles, Plus, RotateCcw, Loader2, Trees } from 'lucide-react';
import Link from 'next/link';
import { mergeCommunityEvents, syncCommunityEventsToServer } from '@/lib/communityEvents';
import TreePlantationGrowthModal from '@/components/animations/TreePlantationGrowthModal';

const CATEGORIES = [
  'All',
  'Donation',
  'Cleanup',
  'Plantation',
  'Healthcare',
  'Education',
  'Relief Aid',
];

function EventsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showTreeModal, setShowTreeModal] = useState(false);

  // Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'date_asc');

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsAPI.getUpcoming({
        type: selectedType,
        search: search.trim() || undefined,
        sort: sort,
      });

      // Merge server events with locally created/saved community events
      let rawEvents = res.success && res.events ? res.events : [];
      let evts = mergeCommunityEvents(rawEvents);

      // Apply type filtering if specified
      if (selectedType && selectedType !== 'All') {
        evts = evts.filter((e) => e.eventType.toLowerCase() === selectedType.toLowerCase());
      }

      // Apply search query filtering
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        evts = evts.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.location.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
        );
      }

      if (sort === 'date_asc') {
        evts.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
      } else if (sort === 'date_desc') {
        evts.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
      }

      setEvents(evts);
      setTotalCount(evts.length);

      // Background synchronization
      syncCommunityEventsToServer().catch(() => {});
    } catch (err) {
      console.error('Error fetching upcoming events:', err);
      // Fallback: load directly from community registry
      const local = mergeCommunityEvents([]);
      setEvents(local);
      setTotalCount(local.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedType, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedType('All');
    setSort('date_asc');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Action Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Upcoming Social Events
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl">
            Browse verified upcoming volunteering and social development drives. Past dates are automatically excluded so you only see active opportunities.
          </p>
        </div>

        <Link
          href="/create-event"
          className="btn-magnetic btn-steel-primary gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-md self-start md:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Host New Event</span>
        </Link>
      </div>

      {/* Interactive Movable Animation Banner: Tree Plantation Seed-to-Harvest */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="text-2xl animate-bounce">🌱</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Interactive Tree Plantation Experience
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 animate-pulse">
                Seed to Harvest Animation
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Click to watch an interactive animated tree develop from a seed in fertile soil to full leafy canopy &amp; fruit harvest!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTreeModal(true)}
          className="btn-magnetic btn-steel-primary px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 shadow-sm cursor-pointer"
        >
          <Trees className="w-4 h-4 text-emerald-200" />
          <span>Launch Tree Animation</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="p-4 sm:p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-8 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, location (e.g. Mirpur, Mohammadpur) or description..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-magnetic btn-steel-primary px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Sort Dropdown */}
          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 shrink-0">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="date_asc">Event Date (Nearest First)</option>
              <option value="date_desc">Event Date (Furthest First)</option>
              <option value="newest">Newly Published</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedType(cat);
                if (cat === 'Plantation') {
                  setShowTreeModal(true);
                }
              }}
              className={`btn-magnetic px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer ${
                selectedType === cat
                  ? 'btn-steel-primary font-bold'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-700/60'
              }`}
            >
              {cat === 'Plantation' ? '🌱 Plantation (Interactive)' : cat}
            </button>
          ))}
          {(search || selectedType !== 'All' || sort !== 'date_asc') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1 shrink-0 ml-auto"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <p>
          Showing <span className="font-bold text-gray-900 dark:text-white">{events.length}</span> upcoming event{events.length === 1 ? '' : 's'}
          {selectedType !== 'All' && <span> in <strong className="text-emerald-600 dark:text-emerald-400">{selectedType}</strong></span>}
        </p>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <EventCardSkeleton key={n} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900/50 space-y-4">
          <Calendar className="w-14 h-14 text-gray-400 mx-auto" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No upcoming events match your filters</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your search terms, choosing a different category, or clearing active filters to see all upcoming initiatives.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Clear All Filters
            </button>
            <Link
              href="/create-event"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow"
            >
              Organize New Event
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}

      {/* Interactive Tree Plantation Modal */}
      <TreePlantationGrowthModal
        isOpen={showTreeModal}
        onClose={() => setShowTreeModal(false)}
        onExplorePlantations={() => setSelectedType('Plantation')}
      />
    </div>
  );
}

export default function UpcomingEventsPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <EventsContent />
    </Suspense>
  );
}
