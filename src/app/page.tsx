'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { EventItem } from '@/types';
import { eventsAPI } from '@/lib/api';
import EventCard from '@/components/events/EventCard';
import { EventCardSkeleton } from '@/components/common/LoadingSkeleton';
import {
  Heart,
  Users,
  CalendarCheck,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MapPin,
  Send,
  CheckCircle,
  Quote,
} from 'lucide-react';
import { toast } from 'sonner';

export default function HomePage() {
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    async function loadRecentEvents() {
      try {
        setLoading(true);
        // Using limit=6 which triggers MongoDB .limit(6) on the backend
        const res = await eventsAPI.getUpcoming({ limit: 6, sort: 'date_asc' });
        if (res.success && res.events) {
          setRecentEvents(res.events);
        }
      } catch (err) {
        console.error('Failed to load recent events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRecentEvents();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing! You will receive our monthly community digest.');
    setNewsletterEmail('');
  };

  // Static Gallery items
  const galleryItems = [
    {
      title: 'Winter Warmth Drive 2026',
      location: 'Mirpur, Dhaka',
      image: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=800&q=80',
      category: 'Clothing Distribution',
    },
    {
      title: 'Hatirjheel Lake Restoration',
      location: 'Hatirjheel, Dhaka',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=800&q=80',
      category: 'Urban Cleanup',
    },
    {
      title: 'School Supplies For Working Kids',
      location: 'Farmgate, Dhaka',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      category: 'Education Aid',
    },
    {
      title: '5,000 Saplings Urban Afforestation',
      location: 'Uttara, Dhaka',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      category: 'Tree Plantation',
    },
    {
      title: 'Emergency Medical & Eye Screening',
      location: 'Korail Slum, Dhaka',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      category: 'Community Health',
    },
    {
      title: 'Ramadan Daily Iftar Packets',
      location: 'Old Dhaka',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80',
      category: 'Food Relief',
    },
  ];

  return (
    <div className="flex flex-col space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO / BANNER SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-transparent to-transparent dark:from-emerald-950/20 dark:via-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Empowering Grassroots Social Impact</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.12]">
                Transform Your City Through{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 dark:from-emerald-400 dark:to-teal-300">
                  Community Action
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join hands with neighborhood volunteers to distribute warm winter clothes, lead lakeside cleanups, plant native trees, and deliver food relief to families who need it most.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link
                  href="/events"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 transition-all"
                >
                  <CalendarCheck className="w-5 h-5" />
                  <span>Explore Upcoming Events</span>
                </Link>

                <Link
                  href="/create-event"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold border-2 border-emerald-600/40 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all"
                >
                  <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Host an Initiative</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-gray-200/80 dark:border-gray-800 grid grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">100%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Non-Profit Driven</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">14,200+</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Meals & Clothes Given</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">25+ Wards</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Dhaka & Beyond</p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 aspect-[4/5]">
                  <Image
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80"
                    alt="Volunteers distributing relief"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-black/20 to-transparent" />
                  
                  {/* Floating Action Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-white/20 dark:border-gray-800 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Active Community Drive
                        </p>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                          Winter Blanket Aid in Mohammadpur
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Accent Glow */}
                <div className="absolute -top-6 -right-6 -z-10 w-64 h-64 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-6 -left-6 -z-10 w-64 h-64 bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PLATFORM FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Designed to Turn Compassion into Real Action
          </h2>
          <p className="text-base text-gray-600 dark:text-gray-400">
            CivicPulse simplifies finding, planning, and organizing humanitarian service events so community members can focus on what matters most: serving others.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hyperlocal Discovery</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Find volunteer initiatives happening right around your corner in Mirpur, Mohammadpur, Uttara, Dhanmondi, or your home division.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-teal-100 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">One-Click RSVP</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Join upcoming events with a single click, automatically sync with your personal calendar, and track all your contributions in one dashboard.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Organizer Toolkit</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Publish community drives with date controls, track volunteer headcounts in real-time, and manage or update event schedules seamlessly.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Transparent & Safe</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Every initiative is tied to verified community organizers with open attendee rosters, ensuring accountability and peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* 3. RECENT UPCOMING EVENTS SECTION (Dynamic from MongoDB with .limit(6)) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Happening Soon
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Recent Upcoming Events
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Freshly scheduled social service drives across your region. Filtered to display only upcoming dates.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group"
          >
            <span>View All Upcoming Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <EventCardSkeleton key={n} />
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <CalendarCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">No upcoming events found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1 mb-6">
              Be the first to step forward! Organize a blanket distribution or cleanup drive in your area today.
            </p>
            <Link
              href="/create-event"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white shadow hover:bg-emerald-700 transition-colors"
            >
              Create an Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* 4. GALLERY SECTION (Static Showcase) */}
      <section className="bg-gray-100/60 dark:bg-gray-900/40 py-16 sm:py-20 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Community Gallery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Moments of Solidarity & Impact
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              A photographic chronicle of civic volunteers delivering warm clothing, planting trees, and caring for our neighbors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={index}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-600 text-white">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-gray-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VOLUNTEER VOICES / TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Voices of Change
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            What Our Community Members Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between space-y-4">
            <Quote className="w-8 h-8 text-emerald-500/40" />
            <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              &quot;Distributing 600 thermal jackets in Mirpur was the most rewarding experience of my winter. CivicPulse made team coordination effortless.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Tahmina"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Tahmina Rahman</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Dhaka Youth Volunteers</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between space-y-4">
            <Quote className="w-8 h-8 text-teal-500/40" />
            <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              &quot;Our lake cleanup at Hatirjheel brought 80+ strangers together. We removed 400kg of waste and made new lifelong friends along the way.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                  alt="Fahim"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Fahim Ahmed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Green City Initiative</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col justify-between space-y-4">
            <Quote className="w-8 h-8 text-indigo-500/40" />
            <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
              &quot;As a medical student, conducting free eye screenings at Korail was profoundly touching. The platform helped us reach exactly who needed it.&quot;
            </p>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&q=80"
                  alt="Dr. Ariful"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Dr. Kazi Ariful Islam</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Medical Camp Coordinator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER SUBSCRIPTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-8 sm:p-12 lg:p-16 shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
            <div className="inline-flex p-3 rounded-2xl bg-white/10 backdrop-blur-md">
              <Send className="w-6 h-6 text-emerald-300" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Stay Informed on Local Drives
            </h2>

            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Subscribe to our bi-weekly volunteer bulletin. Receive urgent call-outs for flood relief, winter blanket drives, and health camps straight to your inbox.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/95 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl text-sm font-bold bg-gray-900 hover:bg-black text-white shadow transition-colors shrink-0"
              >
                Subscribe Free
              </button>
            </form>

            <p className="text-xs text-emerald-200/80">
              🔒 Zero spam. We respect your privacy and only share legitimate civic events. Unsubscribe anytime.
            </p>
          </div>

          {/* Background Decorative Rings */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full border border-white/10" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full border border-white/10" />
        </div>
      </section>
    </div>
  );
}
