import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  X, 
  Search, 
  Download, 
  Check, 
  UserCheck, 
  Trash2,
  Edit,
  Building
} from 'lucide-react';
import { UniEvent, Attendee } from '../types';

interface FacultyDashboardViewProps {
  events: UniEvent[];
  onCreateEvent: (newEvent: Omit<UniEvent, 'id' | 'registeredCount' | 'status'>) => void;
  onDeleteEvent: (eventId: string) => void;
  onViewDetails: (event: UniEvent) => void;
}

export const FacultyDashboardView: React.FC<FacultyDashboardViewProps> = ({
  events,
  onCreateEvent,
  onDeleteEvent,
  onViewDetails
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeRosterEvent, setActiveRosterEvent] = useState<UniEvent | null>(null);
  const [rosterSearch, setRosterSearch] = useState('');

  // Sample attendee roster state for the active event
  const [rosterAttendees, setRosterAttendees] = useState<Record<string, Attendee[]>>({
    'evt-1': [
      { id: 'att-1', name: 'Priyanshu', email: 'priyanshu@university.edu', studentId: 'UE-84920', department: 'Computer Science', registeredAt: '2026-09-10 14:32', checkedIn: true, checkedInAt: '10:02 AM' },
      { id: 'att-2', name: 'Marcus Sterling', email: 'm.sterling@university.edu', studentId: 'UE-82103', department: 'Data Science', registeredAt: '2026-09-11 09:12', checkedIn: false },
      { id: 'att-3', name: 'Chloe Zhao', email: 'chloe.zhao@university.edu', studentId: 'UE-89412', department: 'Software Engineering', registeredAt: '2026-09-11 11:45', checkedIn: true, checkedInAt: '09:58 AM' },
      { id: 'att-4', name: 'Devon Vance', email: 'devon.v@university.edu', studentId: 'UE-79811', department: 'Computer Science', registeredAt: '2026-09-12 16:20', checkedIn: false },
      { id: 'att-5', name: 'Samantha Wu', email: 'sam.wu@university.edu', studentId: 'UE-84519', department: 'Electrical Engineering', registeredAt: '2026-09-12 18:04', checkedIn: true, checkedInAt: '10:05 AM' }
    ]
  });

  // Create Event Form State
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Hands-on Workshops' as any,
    format: 'In-Person' as any,
    level: 'Beginner' as any,
    date: '2026-09-30',
    startTime: '11:00 AM',
    endTime: '2:00 PM',
    venue: 'Turing Computer Science Building',
    room: 'Lab 201',
    capacity: 40,
    credits: 2,
    speakerName: 'Dr. Sarah Connor',
    speakerRole: 'Professor of Computing',
    speakerDepartment: 'Department of Computer Science',
    speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    prerequisitesText: 'Laptop with VS Code installed\nBasic coding knowledge',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    certificateProvided: true,
    organizer: 'Faculty of Computing & Informatics'
  });

  const [formError, setFormError] = useState('');

  const handleToggleCheckIn = (attendeeId: string) => {
    if (!activeRosterEvent) return;
    const eventId = activeRosterEvent.id;
    const currentList = rosterAttendees[eventId] || [];

    setRosterAttendees(prev => ({
      ...prev,
      [eventId]: currentList.map(a => {
        if (a.id === attendeeId) {
          const nextState = !a.checkedIn;
          return {
            ...a,
            checkedIn: nextState,
            checkedInAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined
          };
        }
        return a;
      })
    }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Please provide an event title');
      return;
    }
    if (!formData.venue.trim()) {
      setFormError('Please specify the campus venue');
      return;
    }

    const prereqs = formData.prerequisitesText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    onCreateEvent({
      title: formData.title,
      tagline: formData.tagline || formData.description.slice(0, 100),
      description: formData.description || formData.tagline,
      category: formData.category,
      format: formData.format,
      level: formData.level,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      venue: formData.venue,
      room: formData.room,
      capacity: Number(formData.capacity) || 40,
      credits: Number(formData.credits) || 1,
      isFree: true,
      certificateProvided: formData.certificateProvided,
      speaker: {
        name: formData.speakerName || 'Faculty Guest Speaker',
        role: formData.speakerRole || 'Adjunct Professor',
        department: formData.speakerDepartment || 'Faculty of Sciences',
        avatar: formData.speakerAvatar
      },
      prerequisites: prereqs.length > 0 ? prereqs : ['None - Open to all students'],
      materialsProvided: ['Digital workshop materials', 'Certificate of participation'],
      agenda: [
        { time: `${formData.startTime} - Intro`, title: 'Welcome & Foundations', description: 'Core principles and setup.' },
        { time: 'Mid-Session', title: 'Hands-on Practice', description: 'Practical exercises and lab work.' },
        { time: `${formData.endTime} - Wrap-up`, title: 'Project Showcase & Q&A', description: 'Faculty evaluation and credentials issuance.' }
      ],
      coverImage: formData.coverImage,
      tags: [formData.category, 'Faculty Workshop', 'Campus'],
      organizer: formData.organizer,
      featured: false
    });

    setShowCreateModal(false);
    setFormError('');
  };

  // Get active roster list
  const currentRoster = activeRosterEvent 
    ? (rosterAttendees[activeRosterEvent.id] || [
        { id: 'att-x1', name: 'Jordan Hayes', email: 'j.hayes@university.edu', studentId: 'UE-78291', department: 'Computer Science', registeredAt: '2026-09-10 10:15', checkedIn: false },
        { id: 'att-x2', name: 'Taylor Brooks', email: 't.brooks@university.edu', studentId: 'UE-81290', department: 'Informatics', registeredAt: '2026-09-11 14:20', checkedIn: true, checkedInAt: '10:01 AM' }
      ])
    : [];

  const filteredRoster = currentRoster.filter(a => 
    a.name.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    a.studentId.toLowerCase().includes(rosterSearch.toLowerCase()) ||
    a.department.toLowerCase().includes(rosterSearch.toLowerCase())
  );

  const checkedInCount = currentRoster.filter(a => a.checkedIn).length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Faculty Portal Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Organizer & Faculty Administrator Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Academic Workshop & Event Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Publish official university workshops, review student sign-ups, track live room check-ins, and issue verified academic completion credentials.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          id="create-event-btn"
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Workshop / Event</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Managed Events</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{events.length}</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All systems operational
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registrations</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {events.reduce((acc, curr) => acc + curr.registeredCount, 0)}
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Across 7 campus faculties
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Attendance</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">92.4%</div>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +4.2% from Spring Term
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credits Awardable</div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            {events.reduce((acc, curr) => acc + (curr.credits * curr.registeredCount), 0)}
          </div>
          <p className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> Verified transcript credits
          </p>
        </div>
      </div>

      {/* Events Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Campus Events & Workshops</h2>
            <p className="text-xs text-slate-500">Manage listings, check attendee rosters, and view room assignments.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            {events.length} active items
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Event & Category</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Venue</th>
                <th className="py-3 px-4">Capacity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {events.map((ev) => {
                const percent = Math.min(100, Math.round((ev.registeredCount / ev.capacity) * 100));

                return (
                  <tr key={ev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img 
                          src={ev.coverImage} 
                          alt={ev.title}
                          className="w-10 h-10 rounded-lg object-cover shrink-0 border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p 
                            onClick={() => onViewDetails(ev)}
                            className="font-bold text-slate-900 truncate hover:text-indigo-600 cursor-pointer"
                          >
                            {ev.title}
                          </p>
                          <span className="text-[10px] text-slate-500 font-medium">{ev.category}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{ev.date}</div>
                      <div className="text-slate-500 text-[11px]">{ev.startTime}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 truncate max-w-xs">{ev.venue}</div>
                      {ev.room && <div className="text-slate-400 text-[10px]">{ev.room}</div>}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-slate-800">{ev.registeredCount} / {ev.capacity}</div>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                        <div 
                          className={`h-full rounded-full ${percent >= 90 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ev.registeredCount >= ev.capacity
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {ev.registeredCount >= ev.capacity ? 'Full' : 'Accepting'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveRosterEvent(ev)}
                          id={`manage-roster-btn-${ev.id}`}
                          className="px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                          title="Manage Attendance & Check-in Roster"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Roster</span>
                        </button>

                        <button
                          onClick={() => onViewDetails(ev)}
                          className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="View public preview"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteEvent(ev.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roster Modal */}
      {activeRosterEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Student Attendance Roster</span>
                  <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {checkedInCount} / {currentRoster.length} Checked In
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{activeRosterEvent.title}</h3>
                <p className="text-xs text-slate-500">
                  {activeRosterEvent.date} • {activeRosterEvent.startTime} • {activeRosterEvent.venue}
                </p>
              </div>

              <button
                onClick={() => setActiveRosterEvent(null)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Roster Toolbar */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search attendee by name, student ID..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                onClick={() => {
                  const csvRows = [
                    ['Name', 'Student ID', 'Email', 'Department', 'Checked In'].join(','),
                    ...currentRoster.map(a => [a.name, a.studentId, a.email, a.department, a.checkedIn ? 'Yes' : 'No'].join(','))
                  ].join('\n');
                  const blob = new Blob([csvRows], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `roster-${activeRosterEvent.id}.csv`;
                  a.click();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Attendee List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
              {filteredRoster.map((attendee) => (
                <div key={attendee.id} className="p-3 hover:bg-slate-50 rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">{attendee.name}</p>
                    <p className="text-[11px] text-slate-500">{attendee.studentId} • {attendee.department}</p>
                    <p className="text-[10px] text-slate-400">Registered: {attendee.registeredAt}</p>
                  </div>

                  <button
                    onClick={() => handleToggleCheckIn(attendee.id)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                      attendee.checkedIn
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {attendee.checkedIn ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Present {attendee.checkedInAt ? `(${attendee.checkedInAt})` : ''}</span>
                      </>
                    ) : (
                      <span>Mark Present</span>
                    )}
                  </button>
                </div>
              ))}

              {filteredRoster.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  No attendees found matching search.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Attendance rate for this session: <strong>{Math.round((checkedInCount / Math.max(1, currentRoster.length)) * 100)}%</strong>
              </span>
              <button
                onClick={() => setActiveRosterEvent(null)}
                className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg cursor-pointer"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Publish New Campus Workshop or Event</h3>
                  <p className="text-xs text-slate-500">Creates a live listing with digital ticketing & attendance roster.</p>
                </div>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  {formError}
                </div>
              )}

              {/* Title */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Database Engineering Lab"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Tagline */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Short Tagline / Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Hands-on query optimization and multi-region replication"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Category, Format & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="Hands-on Workshops">Hands-on Workshops</option>
                    <option value="Technology & AI">Technology & AI</option>
                    <option value="Career & Industry">Career & Industry</option>
                    <option value="Academic & Research">Academic & Research</option>
                    <option value="Cultural & Arts">Cultural & Arts</option>
                    <option value="Student Clubs & Sports">Student Clubs & Sports</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Format</label>
                  <select
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Virtual">Virtual Session</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Difficulty Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Start Time</label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">End Time</label>
                  <input
                    type="text"
                    placeholder="1:00 PM"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Venue & Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700 block">Building & Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Turing Computer Science Building, Lab 201"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Max Seats</label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Speaker / Instructor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Lead Instructor / Speaker</label>
                  <input
                    type="text"
                    placeholder="Prof. Name"
                    value={formData.speakerName}
                    onChange={(e) => setFormData({ ...formData, speakerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Department / Organization</label>
                  <input
                    type="text"
                    placeholder="Department of ..."
                    value={formData.speakerDepartment}
                    onChange={(e) => setFormData({ ...formData, speakerDepartment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                  />
                </div>
              </div>

              {/* Prerequisites */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Student Prerequisites (one per line)</label>
                <textarea
                  rows={2}
                  placeholder="Laptop with Node.js installed&#10;Basic SQL knowledge"
                  value={formData.prerequisitesText}
                  onChange={(e) => setFormData({ ...formData, prerequisitesText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none"
                />
              </div>

              {/* Checkboxes */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.certificateProvided}
                    onChange={(e) => setFormData({ ...formData, certificateProvided: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                  />
                  <span>Issue Accredited Digital Certificate</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-create-event-btn"
                  className="px-6 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Publish Workshop to Campus
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
