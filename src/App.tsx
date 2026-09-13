import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DiscoverView } from './components/DiscoverView';
import { WorkshopsView } from './components/WorkshopsView';
import { CalendarView } from './components/CalendarView';
import { MyBookingsView } from './components/MyBookingsView';
import { FacultyDashboardView } from './components/FacultyDashboardView';
import { EventDetailModal } from './components/EventDetailModal';
import { RegistrationModal } from './components/RegistrationModal';
import { DigitalTicketModal } from './components/DigitalTicketModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { INITIAL_EVENTS, INITIAL_BOOKINGS } from './data/initialEvents';
import { UniEvent, Booking } from './types';
import { BookOpen, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<'discover' | 'workshops' | 'calendar' | 'bookings' | 'faculty'>('discover');
  const [searchQuery, setSearchQuery] = useState('');

  // Events State with persistence
  const [events, setEvents] = useState<UniEvent[]>(() => {
    const saved = localStorage.getItem('unievent_events');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved events:', e);
      }
    }
    return INITIAL_EVENTS;
  });

  // Bookings State with persistence
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('unievent_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved bookings:', e);
      }
    }
    return INITIAL_BOOKINGS;
  });

  // Bookmarks State
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('unievent_bookmarks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved bookmarks:', e);
      }
    }
    return ['evt-1'];
  });

  // Modal States
  const [detailEvent, setDetailEvent] = useState<UniEvent | null>(null);
  const [registrationEvent, setRegistrationEvent] = useState<UniEvent | null>(null);
  const [ticketBooking, setTicketBooking] = useState<Booking | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('unievent_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('unievent_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('unievent_bookmarks', JSON.stringify(bookmarkedIds));
  }, [bookmarkedIds]);

  // Active confirmed booking IDs
  const activeBookedEventIds = bookings
    .filter(b => b.status === 'Confirmed' || b.status === 'Waitlisted')
    .map(b => b.eventId);

  // Handlers
  const handleToggleBookmark = (eventId: string) => {
    setBookmarkedIds(prev => {
      const exists = prev.includes(eventId);
      if (exists) {
        addToast('info', 'Bookmark Removed', 'Event removed from your saved list.');
        return prev.filter(id => id !== eventId);
      } else {
        addToast('success', 'Bookmark Saved', 'Event saved to your bookmarks.');
        return [...prev, eventId];
      }
    });
  };

  const handleOpenRegisterModal = (event: UniEvent) => {
    if (activeBookedEventIds.includes(event.id)) {
      const existing = bookings.find(b => b.eventId === event.id && b.status === 'Confirmed');
      if (existing) {
        setTicketBooking(existing);
        return;
      }
    }
    setRegistrationEvent(event);
  };

  const handleConfirmRegistration = (
    event: UniEvent, 
    details: {
      studentName: string;
      studentEmail: string;
      studentId: string;
      department: string;
      yearOfStudy: string;
      specialRequirements?: string;
    }
  ) => {
    const ticketNum = `TKT-${Math.floor(1000 + Math.random() * 9000)}-2026`;
    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      ticketNumber: ticketNum,
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventDate: event.date,
      eventTime: `${event.startTime} - ${event.endTime}`,
      eventVenue: event.room ? `${event.venue}, ${event.room}` : event.venue,
      eventFormat: event.format,
      coverImage: event.coverImage,
      studentName: details.studentName,
      studentEmail: details.studentEmail,
      studentId: details.studentId,
      department: details.department,
      yearOfStudy: details.yearOfStudy,
      bookingDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Confirmed',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=UNIEVENT-${ticketNum}-${details.studentId}`,
      specialRequirements: details.specialRequirements
    };

    // Update bookings
    setBookings(prev => [newBooking, ...prev]);

    // Update event registration count
    setEvents(prev => prev.map(e => {
      if (e.id === event.id) {
        return {
          ...e,
          registeredCount: Math.min(e.capacity, e.registeredCount + 1)
        };
      }
      return e;
    }));

    setRegistrationEvent(null);
    setTicketBooking(newBooking);

    addToast(
      'success',
      'Registration Confirmed!',
      `You are booked for "${event.title}". Digital pass #${ticketNum} is ready.`
    );
  };

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'Cancelled' };
      }
      return b;
    }));

    // Free up seat in event
    setEvents(prev => prev.map(e => {
      if (e.id === booking.eventId) {
        return {
          ...e,
          registeredCount: Math.max(0, e.registeredCount - 1)
        };
      }
      return e;
    }));

    addToast('info', 'Registration Cancelled', `Seat for ${booking.eventTitle} has been released.`);
  };

  const handleCreateEvent = (newEventData: Omit<UniEvent, 'id' | 'registeredCount' | 'status'>) => {
    const newEvent: UniEvent = {
      ...newEventData,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
      status: 'Open'
    };

    setEvents(prev => [newEvent, ...prev]);
    addToast('success', 'Event Published!', `"${newEvent.title}" is now live on the university calendar.`);
  };

  const handleDeleteEvent = (eventId: string) => {
    const target = events.find(e => e.id === eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
    addToast('info', 'Event Removed', `"${target?.title || 'Event'}" was removed.`);
  };

  const handleViewTicketForEvent = (eventId: string) => {
    const existing = bookings.find(b => b.eventId === eventId && b.status === 'Confirmed');
    if (existing) {
      setTicketBooking(existing);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeBookingCount={activeBookedEventIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        
        {/* Tab 1: Discover Events */}
        {currentTab === 'discover' && (
          <DiscoverView
            events={events}
            searchQuery={searchQuery}
            bookedEventIds={activeBookedEventIds}
            bookmarkedEventIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onViewDetails={(ev) => setDetailEvent(ev)}
            onRegister={handleOpenRegisterModal}
            onGoToCalendar={() => setCurrentTab('calendar')}
            onGoToWorkshops={() => setCurrentTab('workshops')}
          />
        )}

        {/* Tab 2: Workshops & Labs */}
        {currentTab === 'workshops' && (
          <WorkshopsView
            events={events}
            searchQuery={searchQuery}
            bookedEventIds={activeBookedEventIds}
            bookmarkedEventIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onViewDetails={(ev) => setDetailEvent(ev)}
            onRegister={handleOpenRegisterModal}
          />
        )}

        {/* Tab 3: Event Calendar */}
        {currentTab === 'calendar' && (
          <CalendarView
            events={events}
            bookedEventIds={activeBookedEventIds}
            onViewDetails={(ev) => setDetailEvent(ev)}
            onRegister={handleOpenRegisterModal}
          />
        )}

        {/* Tab 4: My Bookings & Digital Passes */}
        {currentTab === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onViewTicket={(b) => setTicketBooking(b)}
            onCancelBooking={handleCancelBooking}
            onGoToDiscover={() => setCurrentTab('discover')}
          />
        )}

        {/* Tab 5: Faculty Dashboard & Roster Manager */}
        {currentTab === 'faculty' && (
          <FacultyDashboardView
            events={events}
            onCreateEvent={handleCreateEvent}
            onDeleteEvent={handleDeleteEvent}
            onViewDetails={(ev) => setDetailEvent(ev)}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">UniEvent</span>
            <span>• University Academic Event & Workshop Manager</span>
          </div>

          <div className="flex items-center gap-4 font-medium">
            <button 
              onClick={() => setCurrentTab('discover')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Discover
            </button>
            <button 
              onClick={() => setCurrentTab('workshops')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Workshops
            </button>
            <button 
              onClick={() => setCurrentTab('calendar')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Calendar
            </button>
            <button 
              onClick={() => setCurrentTab('bookings')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              My Bookings
            </button>
            <button 
              onClick={() => setCurrentTab('faculty')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Faculty Portal
            </button>
          </div>

          <p className="text-slate-400">
            Fall Term 2026 • Campus Accredited
          </p>
        </div>
      </footer>

      {/* Global Modals */}
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          isBooked={activeBookedEventIds.includes(detailEvent.id)}
          onClose={() => setDetailEvent(null)}
          onRegister={handleOpenRegisterModal}
          onViewTicketForEvent={handleViewTicketForEvent}
        />
      )}

      {registrationEvent && (
        <RegistrationModal
          event={registrationEvent}
          onClose={() => setRegistrationEvent(null)}
          onConfirmRegistration={handleConfirmRegistration}
        />
      )}

      {ticketBooking && (
        <DigitalTicketModal
          booking={ticketBooking}
          onClose={() => setTicketBooking(null)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}
