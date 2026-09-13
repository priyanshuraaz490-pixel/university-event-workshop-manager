import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Check, 
  Video, 
  Layers,
  GraduationCap
} from 'lucide-react';
import { UniEvent } from '../types';

interface EventDetailModalProps {
  event: UniEvent | null;
  isBooked: boolean;
  onClose: () => void;
  onRegister: (event: UniEvent) => void;
  onViewTicketForEvent?: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isBooked,
  onClose,
  onRegister,
  onViewTicketForEvent
}) => {
  if (!event) return null;

  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isFull = event.registeredCount >= event.capacity;

  return (
    <div 
      id="event-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div 
        id="event-detail-modal-content"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150"
      >
        
        {/* Cover Header */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-900 shrink-0">
          <img 
            src={event.coverImage} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            id="close-detail-modal-btn"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer z-10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Overlays */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-indigo-600 text-white shadow-xs">
                {event.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-md">
                {event.level}
              </span>
              {event.credits > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {event.credits} Academic Credits
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-xs sm:text-sm">
          
          {/* Quick Schedule Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Timing</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
              <p className="text-slate-600 flex items-center gap-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                {event.startTime} - {event.endTime}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Campus Location</span>
              <p className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                {event.venue}
              </p>
              <p className="text-slate-600 text-xs">
                {event.room ? event.room : (
                  event.format === 'Virtual' ? 'Virtual Zoom / Meet Room' : 'Main Hall'
                )}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">About this Workshop</h3>
            <p className="text-slate-600 leading-relaxed text-xs sm:text-sm">
              {event.description}
            </p>
          </div>

          {/* Instructor / Speaker Profile */}
          <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-start gap-3.5">
            <img 
              src={event.speaker.avatar} 
              alt={event.speaker.name}
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20 shrink-0 mt-0.5"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{event.speaker.name}</h4>
                <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                  Lead Instructor
                </span>
              </div>
              <p className="text-xs font-medium text-slate-700">{event.speaker.role} • {event.speaker.department}</p>
              {event.speaker.bio && (
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  {event.speaker.bio}
                </p>
              )}
            </div>
          </div>

          {/* Agenda & Syllabus Breakdown */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Workshop Agenda & Schedule
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-white hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
                    <span className="text-xs font-mono font-bold text-indigo-600 sm:w-36 shrink-0">
                      {item.time}
                    </span>
                    <div>
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900">{item.title}</h5>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites & Included Kit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4 text-indigo-600" />
                Student Prerequisites
              </h4>
              <ul className="space-y-1.5">
                {event.prerequisites.map((req, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Included with Registration
              </h4>
              <ul className="space-y-1.5">
                {event.materialsProvided.map((mat, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{mat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Capacity Progress */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-slate-600 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-slate-400" />
                Live Seat Availability
              </span>
              <span className="font-bold text-slate-800">
                {event.capacity - event.registeredCount} seats remaining ({event.registeredCount}/{event.capacity})
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  isFull ? 'bg-rose-500' : percentFilled >= 80 ? 'bg-amber-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${percentFilled}%` }}
              ></div>
            </div>
          </div>

        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <div className="text-xs">
            <span className="text-slate-500 block">Registration Fee:</span>
            <span className="font-extrabold text-base text-emerald-600">
              {event.isFree ? '100% Free (Campus Funded)' : `$${event.price}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-xs"
            >
              Close
            </button>

            {isBooked ? (
              <button
                onClick={() => {
                  onClose();
                  if (onViewTicketForEvent) {
                    onViewTicketForEvent(event.id);
                  }
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>You&apos;re Registered (View Pass)</span>
              </button>
            ) : isFull ? (
              <button
                disabled
                className="px-5 py-2.5 bg-slate-200 text-slate-500 font-bold rounded-xl text-xs cursor-not-allowed"
              >
                Session Full / Waitlist
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onRegister(event);
                }}
                id="modal-register-confirm-btn"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
              >
                <span>Register for Workshop</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
