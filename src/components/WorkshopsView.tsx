import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Award, 
  CheckCircle2, 
  SlidersHorizontal, 
  Sparkles, 
  GraduationCap, 
  CheckSquare, 
  Laptop
} from 'lucide-react';
import { UniEvent, EventLevel, EventFormat } from '../types';
import { EventCard } from './EventCard';

interface WorkshopsViewProps {
  events: UniEvent[];
  searchQuery: string;
  bookedEventIds: string[];
  bookmarkedEventIds: string[];
  onToggleBookmark: (eventId: string) => void;
  onViewDetails: (event: UniEvent) => void;
  onRegister: (event: UniEvent) => void;
}

export const WorkshopsView: React.FC<WorkshopsViewProps> = ({
  events,
  searchQuery,
  bookedEventIds,
  bookmarkedEventIds,
  onToggleBookmark,
  onViewDetails,
  onRegister
}) => {
  const [selectedLevel, setSelectedLevel] = useState<EventLevel>('All Levels');
  const [selectedFormat, setSelectedFormat] = useState<'All' | EventFormat>('All');
  const [onlyCertificates, setOnlyCertificates] = useState(false);
  const [onlyCreditBearing, setOnlyCreditBearing] = useState(false);

  // Workshop-specific list (events that are hands-on workshops, tech masterclasses, or labs)
  const workshopEvents = useMemo(() => {
    return events.filter(e => 
      e.category === 'Hands-on Workshops' || 
      e.category === 'Technology & AI' ||
      e.certificateProvided ||
      e.prerequisites.length > 0
    );
  }, [events]);

  const filteredWorkshops = useMemo(() => {
    return workshopEvents.filter(e => {
      // Level filter
      if (selectedLevel !== 'All Levels' && e.level !== selectedLevel) {
        return false;
      }
      // Format filter
      if (selectedFormat !== 'All' && e.format !== selectedFormat) {
        return false;
      }
      // Certificate filter
      if (onlyCertificates && !e.certificateProvided) {
        return false;
      }
      // Credits filter
      if (onlyCreditBearing && e.credits <= 0) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = e.title.toLowerCase().includes(q);
        const matchesDesc = e.description.toLowerCase().includes(q);
        const matchesSpeaker = e.speaker.name.toLowerCase().includes(q);
        const matchesTags = e.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesSpeaker && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [workshopEvents, selectedLevel, selectedFormat, onlyCertificates, onlyCreditBearing, searchQuery]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 md:p-10 text-white border border-purple-900/50 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-purple-500/30 text-purple-200 border border-purple-400/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-purple-300" />
            Accredited Hands-on Training
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Workshops, Lab Masterclasses & Certifications
          </h1>
          <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
            Level up your technical, research, and career skillsets. All sessions feature interactive coding or practical exercises, faculty guidance, and verifiable completion certificates.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-purple-200">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free for Enrolled Students
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Award className="w-4 h-4 text-amber-300" /> Official Transcript Credits
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Laptop className="w-4 h-4 text-sky-300" /> Lab Workstations & Cloud Sandboxes Provided
            </span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Skill Level Selection */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Level:
            </span>
            {(['All Levels', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
              <button
                key={lvl}
                id={`level-filter-${lvl.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedLevel === lvl
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Checkbox Toggles */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={onlyCertificates}
                onChange={(e) => setOnlyCertificates(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
              />
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                Certificate Included
              </span>
            </label>

            <label className="flex items-center gap-1.5 font-semibold text-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox"
                checked={onlyCreditBearing}
                onChange={(e) => setOnlyCreditBearing(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
              />
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                Credit Bearing
              </span>
            </label>
          </div>

        </div>

        {/* Format Bar */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>Format:</span>
            {(['All', 'In-Person', 'Virtual', 'Hybrid'] as const).map(fmt => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                  selectedFormat === fmt 
                    ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="font-semibold text-slate-700">
            {filteredWorkshops.length} workshops available
          </div>
        </div>
      </div>

      {/* Workshop Cards Grid */}
      {filteredWorkshops.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkshops.map((workshop) => (
            <EventCard
              key={workshop.id}
              event={workshop}
              isBooked={bookedEventIds.includes(workshop.id)}
              isBookmarked={bookmarkedEventIds.includes(workshop.id)}
              onToggleBookmark={onToggleBookmark}
              onViewDetails={onViewDetails}
              onRegister={onRegister}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-md mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No workshops match your criteria</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try resetting your difficulty filters or uncheck the certificate requirements.
          </p>
          <button
            onClick={() => {
              setSelectedLevel('All Levels');
              setSelectedFormat('All');
              setOnlyCertificates(false);
              setOnlyCreditBearing(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl cursor-pointer"
          >
            Reset Workshop Filters
          </button>
        </div>
      )}

      {/* Workshop Guidelines Box */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-indigo-600" />
          Workshop Attendance & Certificate Policy
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">1. Laptop & Tool Requirements</h4>
            <p className="text-slate-500 leading-relaxed">
              Check the workshop prerequisites before attending. Software dependencies (Python, Node.js, Docker) should be downloaded prior to the lab.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">2. Digital QR Check-in</h4>
            <p className="text-slate-500 leading-relaxed">
              Have your digital boarding pass ready on your phone from &ldquo;My Bookings&rdquo; for scanning at the door by faculty TAs.
            </p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800">3. Verified Credentials</h4>
            <p className="text-slate-500 leading-relaxed">
              Certificates of completion are issued automatically within 24 hours of workshop conclusion and synced to your student transcript.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
