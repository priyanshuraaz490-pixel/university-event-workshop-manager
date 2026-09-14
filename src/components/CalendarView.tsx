import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  Filter,
  Download,
  Video
} from 'lucide-react';
import { UniEvent, EventCategory } from '../types';

interface CalendarViewProps {
  events: UniEvent[];
  bookedEventIds: string[];
  onViewDetails: (event: UniEvent) => void;
  onRegister: (event: UniEvent) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  bookedEventIds,
  onViewDetails,
  onRegister
}) => {
  // Current view mode: Month, Week, or Agenda
  const [viewMode, setViewMode] = useState<'month' | 'agenda'>('month');
  
  // Focused date - default to September 2026 (matching academic term in prompt)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 8, 16)); // Sept 16, 2026
  const [selectedDay, setSelectedDay] = useState<string>('2026-09-16');
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | 'All'>('All');

  // Month navigation
  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(2026, 8, 16));
    setSelectedDay('2026-09-16');
  };

  // Month computation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Filter events by category if selected
  const filteredEvents = useMemo(() => {
    if (categoryFilter === 'All') return events;
    return events.filter(e => e.category === categoryFilter);
  }, [events, categoryFilter]);

  // Calendar cells generation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDateObj = new Date(year, month - 1, dayNum);
      const dateString = `${prevDateObj.getFullYear()}-${String(prevDateObj.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({
        dayNumber: dayNum,
        dateString,
        isCurrentMonth: false,
        events: filteredEvents.filter(e => e.date === dateString)
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateString,
        isCurrentMonth: true,
        events: filteredEvents.filter(e => e.date === dateString)
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      const nextDateObj = new Date(year, month + 1, i);
      const dateString = `${nextDateObj.getFullYear()}-${String(nextDateObj.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNumber: i,
        dateString,
        isCurrentMonth: false,
        events: filteredEvents.filter(e => e.date === dateString)
      });
    }

    return days;
  }, [year, month, filteredEvents]);

  // Events on the selected day
  const selectedDayEvents = useMemo(() => {
    return filteredEvents.filter(e => e.date === selectedDay);
  }, [filteredEvents, selectedDay]);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Technology & AI':
        return 'bg-blue-500 text-white';
      case 'Hands-on Workshops':
        return 'bg-purple-500 text-white';
      case 'Career & Industry':
        return 'bg-emerald-500 text-white';
      case 'Academic & Research':
        return 'bg-indigo-600 text-white';
      case 'Cultural & Arts':
        return 'bg-rose-500 text-white';
      case 'Student Clubs & Sports':
        return 'bg-amber-500 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  const handleExportICS = () => {
    // Generate simple .ics calendar file
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//UniEvent//Academic Event Manager//EN',
      'CALSCALE:GREGORIAN',
      ...filteredEvents.map(e => [
        'BEGIN:VEVENT',
        `SUMMARY:${e.title}`,
        `DESCRIPTION:${e.tagline}`,
        `LOCATION:${e.venue}`,
        `DTSTART:${e.date.replace(/-/g, '')}T100000Z`,
        `DTEND:${e.date.replace(/-/g, '')}T130000Z`,
        'END:VEVENT'
      ].join('\n')),
      'END:VCALENDAR'
    ].join('\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `UniEvent-Calendar-${monthName.replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Calendar Top Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Campus Schedule
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarIcon className="w-7 h-7 text-indigo-600" />
            <span>Academic Event Calendar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            View upcoming dates, scheduled sessions, and room reservations across campus.
          </p>
        </div>

        {/* View mode toggle & ICS download */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportICS}
            id="export-calendar-btn"
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download iCal file for Google Calendar / Apple Calendar"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Sync / iCal</span>
          </button>

          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'month'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month Grid
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'agenda'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Agenda View
            </button>
          </div>
        </div>
      </div>

      {/* Navigation & Month Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Month Navigator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-slate-900 min-w-44">
            {monthName}
          </h2>

          <button
            onClick={goToToday}
            className="px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Category Filter dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Categories ({events.length})</option>
            <option value="Technology & AI">Technology & AI</option>
            <option value="Hands-on Workshops">Hands-on Workshops</option>
            <option value="Career & Industry">Career & Industry</option>
            <option value="Academic & Research">Academic & Research</option>
            <option value="Cultural & Arts">Cultural & Arts</option>
            <option value="Student Clubs & Sports">Student Clubs & Sports</option>
          </select>
        </div>
      </div>

      {viewMode === 'month' ? (
        /* Month Grid Layout */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar Grid (2 cols on large) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 py-3">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
              {calendarDays.map((day, idx) => {
                const isSelected = selectedDay === day.dateString;
                const isToday = day.dateString === '2026-09-16';

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDay(day.dateString)}
                    id={`cal-day-${day.dateString}`}
                    className={`min-h-[90px] sm:min-h-[105px] p-1.5 sm:p-2 transition-all cursor-pointer flex flex-col justify-between ${
                      !day.isCurrentMonth
                        ? 'bg-slate-50/50 text-slate-400'
                        : 'bg-white text-slate-800'
                    } ${
                      isSelected
                        ? 'ring-2 ring-indigo-600 ring-inset bg-indigo-50/30'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    {/* Day number header */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday 
                          ? 'bg-indigo-600 text-white' 
                          : isSelected 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : ''
                      }`}>
                        {day.dayNumber}
                      </span>
                      {day.events.length > 0 && (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded-full">
                          {day.events.length}
                        </span>
                      )}
                    </div>

                    {/* Events pills inside the day */}
                    <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                      {day.events.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(ev);
                          }}
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded truncate shadow-xs cursor-pointer hover:opacity-90 ${getCategoryColor(ev.category)}`}
                          title={`${ev.title} (${ev.startTime})`}
                        >
                          {ev.startTime.split(' ')[0]} {ev.title}
                        </div>
                      ))}
                      {day.events.length > 2 && (
                        <div className="text-[9px] font-bold text-slate-500 pl-1">
                          +{day.events.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Panel: Selected Day's Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col">
            <div className="border-b border-slate-100 pb-4 mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Day Schedule</div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedDayEvents.length === 0 
                  ? 'No events scheduled on this day.' 
                  : `${selectedDayEvents.length} session(s) on schedule`}
              </p>
            </div>

            {selectedDayEvents.length > 0 ? (
              <div className="space-y-4 overflow-y-auto max-h-[480px] pr-1">
                {selectedDayEvents.map((ev) => {
                  const isBooked = bookedEventIds.includes(ev.id);
                  return (
                    <div 
                      key={ev.id}
                      className="p-3.5 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-xs transition-all bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getCategoryColor(ev.category)}`}>
                          {ev.category}
                        </span>
                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {ev.startTime}
                        </span>
                      </div>

                      <h4 
                        onClick={() => onViewDetails(ev)}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2"
                      >
                        {ev.title}
                      </h4>

                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ev.venue}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-200/70 flex items-center gap-2">
                        <button
                          onClick={() => onViewDetails(ev)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex-1 cursor-pointer text-center"
                        >
                          Details
                        </button>

                        {isBooked ? (
                          <span className="px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-center gap-1 flex-1">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Booked
                          </span>
                        ) : (
                          <button
                            onClick={() => onRegister(ev)}
                            className="px-2.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex-1 transition-colors cursor-pointer text-center"
                          >
                            Register
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center text-slate-400">
                <CalendarIcon className="w-10 h-10 stroke-[1.5] mb-2 text-slate-300" />
                <p className="text-xs font-medium">No sessions scheduled for this date.</p>
                <p className="text-[11px] text-slate-400 mt-1">Select another day with event dots to view details.</p>
              </div>
            )}
          </div>

        </div>
      ) : (
        /* Agenda / Chronological List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
          {filteredEvents.map((ev) => {
            const isBooked = bookedEventIds.includes(ev.id);
            return (
              <div 
                key={ev.id}
                className="p-4 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Date block */}
                <div className="flex items-center gap-4 sm:w-64 shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center text-center shrink-0">
                    <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-wider">
                      {new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                    <span className="text-xl font-black text-indigo-900 leading-none">
                      {new Date(ev.date + 'T00:00:00').getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {ev.startTime} - {ev.endTime}
                    </div>
                  </div>
                </div>

                {/* Event info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getCategoryColor(ev.category)}`}>
                      {ev.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      {ev.format === 'Virtual' ? (
                        <span className="inline-flex items-center gap-1 text-sky-600 font-medium">
                          <Video className="w-3 h-3" /> Virtual Session
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" /> {ev.venue}
                        </span>
                      )}
                    </span>
                  </div>

                  <h3 
                    onClick={() => onViewDetails(ev)}
                    className="font-bold text-base text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate"
                  >
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{ev.tagline}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onViewDetails(ev)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    Details
                  </button>

                  {isBooked ? (
                    <span className="px-3.5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Booked
                    </span>
                  ) : (
                    <button
                      onClick={() => onRegister(ev)}
                      className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <span>Register</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
