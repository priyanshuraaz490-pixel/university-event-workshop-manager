import React, { useState } from 'react';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Download, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Award,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { Booking, User } from '../types';
import { CURRENT_STUDENT } from '../data/initialEvents';

interface MyBookingsViewProps {
  bookings: Booking[];
  currentUser: User | null;
  onViewTicket: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onGoToDiscover: () => void;
  onOpenLogin: (role?: 'student' | 'faculty' | 'admin') => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  currentUser,
  onViewTicket,
  onCancelBooking,
  onGoToDiscover,
  onOpenLogin
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'upcoming' | 'past' | 'cancelled'>('upcoming');
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);

  if (!currentUser) {
    return (
      <div className="py-12 max-w-lg mx-auto text-center space-y-6 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Student Portal Protected
            </span>
            <h2 className="text-2xl font-black text-slate-900">Student Authentication Required</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              Please sign in with your verified university student credentials to access your booked passes, attendance credentials, and workshop credits.
            </p>
          </div>

          <button
            onClick={() => onOpenLogin('student')}
            id="student-signin-btn"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Sign In to Student Portal</span>
          </button>
        </div>
      </div>
    );
  }

  const activeStudent = {
    name: currentUser.name || CURRENT_STUDENT.name,
    avatar: currentUser.avatar || CURRENT_STUDENT.avatar,
    studentId: currentUser.studentId || CURRENT_STUDENT.studentId,
    department: currentUser.department || CURRENT_STUDENT.department,
    yearOfStudy: currentUser.yearOfStudy || CURRENT_STUDENT.yearOfStudy,
    academicCredits: currentUser.academicCredits ?? CURRENT_STUDENT.academicCredits
  };

  const filteredBookings = bookings.filter(b => {
    if (filterTab === 'all') return true;
    if (filterTab === 'cancelled') return b.status === 'Cancelled';
    if (filterTab === 'upcoming') return b.status === 'Confirmed' || b.status === 'Waitlisted';
    if (filterTab === 'past') return b.status === 'Checked In';
    return true;
  });

  const activeCount = bookings.filter(b => b.status === 'Confirmed').length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Student Profile & Pass Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img 
            src={activeStudent.avatar} 
            alt={activeStudent.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md shrink-0"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {activeStudent.name}
              </h1>
              <span className="bg-indigo-500/30 text-indigo-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-indigo-400/30">
                Verified Student
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Registration No.: {activeStudent.studentId} • {activeStudent.department} • {activeStudent.yearOfStudy}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-indigo-300 font-semibold">
                <Ticket className="w-3.5 h-3.5" /> {activeCount} Active Event Pass(es)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Award className="w-3.5 h-3.5" /> {activeStudent.academicCredits} Earned Activity Credits
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onGoToDiscover}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer shrink-0"
        >
          + Register Another Event
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterTab('upcoming')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filterTab === 'upcoming'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Upcoming Passes ({bookings.filter(b => b.status === 'Confirmed' || b.status === 'Waitlisted').length})
          </button>

          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filterTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setFilterTab('cancelled')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filterTab === 'cancelled'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Cancelled ({bookings.filter(b => b.status === 'Cancelled').length})
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          Showing {filteredBookings.length} booking(s)
        </span>
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((booking) => {
            const isCancelled = booking.status === 'Cancelled';

            return (
              <div
                key={booking.id}
                id={`booking-card-${booking.id}`}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md ${
                  isCancelled 
                    ? 'border-slate-200 opacity-70 bg-slate-50/50' 
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                {/* Card Top */}
                <div>
                  <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                    <img 
                      src={booking.coverImage} 
                      alt={booking.eventTitle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 backdrop-blur-md shadow-xs">
                        {booking.eventCategory}
                      </span>
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-700'
                          : booking.status === 'Checked In'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-500 text-white'
                      }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <span className="text-[10px] font-mono tracking-wider text-indigo-300 font-bold block">
                        PASS {booking.ticketNumber}
                      </span>
                      <h3 className="font-bold text-base text-white truncate drop-shadow-sm">
                        {booking.eventTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Date & Time</span>
                        <p className="font-bold text-slate-800 flex items-center gap-1 truncate">
                          <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          {booking.eventDate}
                        </p>
                        <p className="text-slate-500 text-[11px] flex items-center gap-1 truncate">
                          <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                          {booking.eventTime}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                        <p className="font-bold text-slate-800 flex items-center gap-1 truncate">
                          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                          {booking.eventFormat}
                        </p>
                        <p className="text-slate-500 text-[11px] truncate">
                          {booking.eventVenue}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Registered to: <strong className="text-slate-700">{booking.studentName}</strong></span>
                      <span className="font-mono text-[11px]">Registration No.: {booking.studentId}</span>
                    </div>

                    {booking.specialRequirements && (
                      <div className="p-2 bg-amber-50 rounded-lg text-[11px] text-amber-800 border border-amber-200/60">
                        <strong>Note:</strong> {booking.specialRequirements}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 sm:p-5 pt-0 flex items-center gap-2">
                  {!isCancelled ? (
                    <>
                      <button
                        onClick={() => onViewTicket(booking)}
                        id={`view-pass-btn-${booking.id}`}
                        className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>View Pass / QR</span>
                      </button>

                      <button
                        onClick={() => setCancelModalBooking(booking)}
                        id={`cancel-booking-btn-${booking.id}`}
                        className="p-2.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                        title="Cancel Registration"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-2 bg-slate-100 rounded-xl text-center text-xs font-semibold text-slate-500">
                      Registration Cancelled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No bookings in this category</h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse our campus catalog and register for hands-on workshops, seminars, and networking sessions.
          </p>
          <button
            onClick={onGoToDiscover}
            className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
          >
            Explore University Events &rarr;
          </button>
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">Cancel Event Registration?</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Are you sure you want to cancel your seat for <strong className="text-slate-800">{cancelModalBooking.eventTitle}</strong>?
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Your ticket (<span className="font-mono font-bold text-slate-700">{cancelModalBooking.ticketNumber}</span>) will be revoked and the seat will be made available to waitlisted students.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Keep My Seat
              </button>

              <button
                id="confirm-cancel-booking-btn"
                onClick={() => {
                  onCancelBooking(cancelModalBooking.id);
                  setCancelModalBooking(null);
                }}
                className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors cursor-pointer"
              >
                Yes, Cancel Seat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
