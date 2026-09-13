import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Filter, 
  Award,
  Layers,
  GraduationCap,
  Users,
  Compass,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Wrench,
  Briefcase,
  BookOpen,
  Palette,
  Trophy
} from 'lucide-react';
import { UniEvent, EventCategory, EventFormat } from '../types';
import { EventCard } from './EventCard';

interface DiscoverViewProps {
  events: UniEvent[];
  searchQuery: string;
  bookedEventIds: string[];
  bookmarkedEventIds: string[];
  onToggleBookmark: (eventId: string) => void;
  onViewDetails: (event: UniEvent) => void;
  onRegister: (event: UniEvent) => void;
  onGoToCalendar: () => void;
  onGoToWorkshops: () => void;
}

const CATEGORIES: { name: EventCategory; icon: React.FC<{ className?: string }> }[] = [
  { name: 'All', icon: Layers },
  { name: 'Technology & AI', icon: Cpu },
  { name: 'Hands-on Workshops', icon: Wrench },
  { name: 'Career & Industry', icon: Briefcase },
  { name: 'Academic & Research', icon: BookOpen },
  { name: 'Cultural & Arts', icon: Palette },
  { name: 'Student Clubs & Sports', icon: Trophy }
];

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  events,
  searchQuery,
  bookedEventIds,
  bookmarkedEventIds,
  onToggleBookmark,
  onViewDetails,
  onRegister,
  onGoToCalendar,
  onGoToWorkshops
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [selectedFormat, setSelectedFormat] = useState<'All' | EventFormat>('All');
  const [sortBy, setSortBy] = useState<'date' | 'popular' | 'seats'>('date');

  // Featured Event (highest priority or first featured)
  const featuredEvent = useMemo(() => {
    return events.find(e => e.featured) || events[0];
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Category filter
      if (selectedCategory !== 'All' && event.category !== selectedCategory) {
        return false;
      }
      // Format filter
      if (selectedFormat !== 'All' && event.format !== selectedFormat) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = event.title.toLowerCase().includes(q);
        const matchesDesc = event.description.toLowerCase().includes(q);
        const matchesSpeaker = event.speaker.name.toLowerCase().includes(q);
        const matchesVenue = event.venue.toLowerCase().includes(q);
        const matchesTags = event.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSpeaker && !matchesVenue && !matchesTags) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return b.registeredCount - a.registeredCount;
      }
      if (sortBy === 'seats') {
        return (a.capacity - a.registeredCount) - (b.capacity - b.registeredCount);
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [events, selectedCategory, selectedFormat, searchQuery, sortBy]);

  const totalRegistrations = useMemo(() => {
    return events.reduce((acc, curr) => acc + curr.registeredCount, 0);
  }, [events]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Showcase (Featured Event Banner) */}
      {featuredEvent && (
        <section 
          id="featured-event-hero"
          className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl text-white"
        >
          <div className="absolute inset-0 z-0">
            <img 
              src={featuredEvent.coverImage} 
              alt={featuredEvent.title}
              className="w-full h-full object-cover opacity-35 filter blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-indigo-950/50"></div>
          </div>

          <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1 bg-amber-400/90 text-slate-950 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Featured Spotlight
              </span>
              <span className="bg-indigo-600/80 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
                {featuredEvent.category}
              </span>
              <span className="bg-white/15 text-slate-200 px-2.5 py-1 rounded-full text-xs font-medium">
                {featuredEvent.format}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {featuredEvent.title}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              {featuredEvent.tagline}
            </p>

            {/* Quick Meta */}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <Calendar className="w-4 h-4 text-amber-300" />
                <span>
                  {new Date(featuredEvent.date + 'T00:00:00').toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })} • {featuredEvent.startTime}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{featuredEvent.venue}</span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md">
                <Award className="w-4 h-4 text-amber-300" />
                <span>Earn {featuredEvent.credits} Academic Credits</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {bookedEventIds.includes(featuredEvent.id) ? (
                <div className="inline-flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>You are Registered for this Event</span>
                </div>
              ) : (
                <button
                  id="featured-register-btn"
                  onClick={() => onRegister(featuredEvent)}
                  className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
                >
                  <span>Book Your Spot Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <button
                id="featured-details-btn"
                onClick={() => onViewDetails(featuredEvent)}
                className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-5 py-3 rounded-xl backdrop-blur-md transition-colors cursor-pointer"
              >
                <span>View Full Syllabus & Speaker</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* University Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">{events.length}</div>
            <div className="text-xs text-slate-500 font-medium">Active Campus Events</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">{totalRegistrations}</div>
            <div className="text-xs text-slate-500 font-medium">Student Signups</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">100% Free</div>
            <div className="text-xs text-slate-500 font-medium">For University Students</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-extrabold text-slate-900">Accredited</div>
            <div className="text-xs text-slate-500 font-medium">Verified Certificates</div>
          </div>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Explore by Category</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredEvents.length} events
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            const count = cat.name === 'All' 
              ? events.length 
              : events.filter(e => e.category === cat.name).length;

            return (
              <button
                key={cat.name}
                id={`cat-pill-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs shadow-indigo-600/20'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/90'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        {/* Format Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Format:</span>
          {(['All', 'In-Person', 'Virtual', 'Hybrid'] as const).map((fmt) => (
            <button
              key={fmt}
              id={`format-filter-${fmt.toLowerCase()}`}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedFormat === fmt
                  ? 'bg-white text-indigo-700 border border-slate-300 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {fmt === 'All' ? 'All Formats' : fmt}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="date">Upcoming Date</option>
            <option value="popular">Most Popular</option>
            <option value="seats">Fewest Seats Left</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isBooked={bookedEventIds.includes(event.id)}
              isBookmarked={bookmarkedEventIds.includes(event.id)}
              onToggleBookmark={onToggleBookmark}
              onViewDetails={onViewDetails}
              onRegister={onRegister}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No matching events found</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Try adjusting your search keywords, clear category filters, or browse our full schedule in the calendar.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedFormat('All');
              }}
              className="px-4 py-2 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={onGoToCalendar}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
            >
              View Calendar
            </button>
          </div>
        </div>
      )}

      {/* Secondary Banner: Need Help or Proposing a Workshop? */}
      <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-md">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" /> Faculty & Club Leads
          </div>
          <h3 className="text-xl sm:text-2xl font-black">
            Hosting a campus workshop or student symposium?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Faculty members, researchers, and club presidents can publish events, issue accredited digital certificates, and manage registrations directly via the portal.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={onGoToWorkshops}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Browse Labs & Masterclasses
          </button>
          <button
            onClick={onGoToCalendar}
            className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md transition-colors cursor-pointer"
          >
            Open Term Schedule &rarr;
          </button>
        </div>
      </section>

    </div>
  );
};
