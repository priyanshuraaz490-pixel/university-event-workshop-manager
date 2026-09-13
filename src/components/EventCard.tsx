import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Award, 
  ArrowRight, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle,
  Video
} from 'lucide-react';
import { UniEvent } from '../types';

interface EventCardProps {
  event: UniEvent;
  isBooked: boolean;
  isBookmarked: boolean;
  onToggleBookmark: (eventId: string) => void;
  onViewDetails: (event: UniEvent) => void;
  onRegister: (event: UniEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isBooked,
  isBookmarked,
  onToggleBookmark,
  onViewDetails,
  onRegister
}) => {
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isFull = event.registeredCount >= event.capacity;

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Technology & AI':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Hands-on Workshops':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Career & Industry':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Academic & Research':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Cultural & Arts':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Student Clubs & Sports':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div 
      id={`event-card-${event.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden group"
    >
      {/* Cover Image & Overlays */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img 
          src={event.coverImage} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-xs backdrop-blur-md bg-white/95 ${getCategoryColor(event.category)}`}>
            {event.category}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(event.id);
            }}
            id={`bookmark-btn-${event.id}`}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-sm backdrop-blur-md transition-transform active:scale-90 cursor-pointer"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            ) : (
              <Bookmark className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        {/* Bottom format & status */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-semibold drop-shadow-sm">
            {event.format === 'Virtual' ? (
              <span className="inline-flex items-center gap-1 bg-sky-500/90 px-2 py-0.5 rounded-md text-[11px]">
                <Video className="w-3 h-3" /> Virtual
              </span>
            ) : event.format === 'Hybrid' ? (
              <span className="inline-flex items-center gap-1 bg-purple-500/90 px-2 py-0.5 rounded-md text-[11px]">
                <MapPin className="w-3 h-3" /> Hybrid Campus
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded-md text-[11px]">
                <MapPin className="w-3 h-3 text-emerald-400" /> In-Person
              </span>
            )}

            {event.credits > 0 && (
              <span className="inline-flex items-center gap-1 bg-amber-500/90 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-950">
                <Award className="w-3 h-3" /> {event.credits} Credits
              </span>
            )}
          </div>

          {event.certificateProvided && (
            <span className="text-[11px] bg-emerald-600/90 px-2 py-0.5 rounded-md font-semibold text-white">
              Certificate
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-2">
            <span className="inline-flex items-center gap-1 text-indigo-600 font-bold">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {event.startTime} - {event.endTime}
            </span>
          </div>

          {/* Title & Tagline */}
          <h3 
            onClick={() => onViewDetails(event)}
            className="font-bold text-base sm:text-lg text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer"
          >
            {event.title}
          </h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {event.tagline || event.description}
          </p>

          {/* Venue */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {event.venue} {event.room ? `• ${event.room}` : ''}
            </span>
          </div>

          {/* Speaker / Host Info */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2.5">
            <img 
              src={event.speaker.avatar} 
              alt={event.speaker.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">{event.speaker.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{event.speaker.department}</p>
            </div>
          </div>
        </div>

        {/* Capacity Progress & Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Seats Filled
            </span>
            <span className={isFull ? 'font-bold text-rose-600' : 'text-slate-700 font-semibold'}>
              {event.registeredCount} / {event.capacity} ({percentFilled}%)
            </span>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-4">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                isFull ? 'bg-rose-500' : percentFilled > 80 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${percentFilled}%` }}
            ></div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <button
              id={`view-details-btn-${event.id}`}
              onClick={() => onViewDetails(event)}
              className="flex-1 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer text-center"
            >
              Details
            </button>

            {isBooked ? (
              <button
                id={`registered-badge-btn-${event.id}`}
                onClick={() => onViewDetails(event)}
                className="flex-1 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Booked
              </button>
            ) : isFull ? (
              <button
                disabled
                className="flex-1 px-3 py-2 text-xs font-semibold text-slate-400 bg-slate-100 rounded-xl cursor-not-allowed text-center"
              >
                Full / Waitlist
              </button>
            ) : (
              <button
                id={`register-btn-${event.id}`}
                onClick={() => onRegister(event)}
                className="flex-1 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs shadow-indigo-600/20 flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
