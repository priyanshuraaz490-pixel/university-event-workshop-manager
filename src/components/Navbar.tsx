import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  BookOpen, 
  Ticket, 
  ShieldCheck, 
  Search, 
  Bell, 
  CheckCircle2, 
  X,
  Sparkles,
  ChevronDown,
  Lock,
  LogOut,
  User as UserIcon,
  Shield,
  KeyRound
} from 'lucide-react';
import { NotificationItem, User } from '../types';

interface NavbarProps {
  currentTab: 'discover' | 'workshops' | 'calendar' | 'bookings' | 'faculty' | 'admin';
  onSelectTab: (tab: 'discover' | 'workshops' | 'calendar' | 'bookings' | 'faculty' | 'admin') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeBookingCount: number;
  currentUser: User | null;
  onOpenLogin: (role?: 'faculty' | 'admin' | 'student') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  activeBookingCount,
  currentUser,
  onOpenLogin,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Security Notice',
      message: 'Server-side Role-Based Access Control (RBAC) active for Faculty & Admin portals.',
      time: 'Just now',
      read: false,
      type: 'info'
    },
    {
      id: 'notif-2',
      title: 'Registration Confirmed',
      message: 'Your seat for Generative AI Masterclass in Lab 402 is secured.',
      time: '2 hours ago',
      read: false,
      type: 'success'
    },
    {
      id: 'notif-3',
      title: 'Reminder: Startup Expo',
      message: 'Don’t forget to upload your digital resume before Friday.',
      time: '2 days ago',
      read: true,
      type: 'warning'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const isFaculty = currentUser?.role === 'faculty' || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full text-[11px] font-semibold">
          <Sparkles className="w-3 h-3 text-amber-300" />
          Fall 2026 Academic Term
        </span>
        <span className="hidden sm:inline text-indigo-100">
          Campus workshops, faculty research symposia, and student event registrations are live.
        </span>
        <span className="hidden md:inline text-xs text-indigo-300">
          • Role-Based Access Control: Active
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => onSelectTab('discover')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
            id="unievent-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <div className="relative">
                <BookOpen className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-indigo-600"></span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Uni<span className="text-indigo-600">Event</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md border border-indigo-200/60">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Academic Event & Workshop Manager
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              id="navbar-search-input"
              type="text"
              placeholder="Search events, speakers, labs..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Primary Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            <button
              id="nav-tab-discover"
              onClick={() => onSelectTab('discover')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === 'discover'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-500" />
              <span>Discover</span>
            </button>

            <button
              id="nav-tab-workshops"
              onClick={() => onSelectTab('workshops')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === 'workshops'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <BookOpen className="w-4 h-4 text-indigo-500" />
              <span>Workshops</span>
            </button>

            <button
              id="nav-tab-calendar"
              onClick={() => onSelectTab('calendar')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === 'calendar'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>Calendar</span>
            </button>

            <button
              id="nav-tab-bookings"
              onClick={() => onSelectTab('bookings')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer relative ${
                currentTab === 'bookings'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              }`}
            >
              <Ticket className="w-4 h-4 text-indigo-500" />
              <span>My Bookings</span>
              {activeBookingCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[11px] font-bold bg-indigo-600 text-white rounded-full">
                  {activeBookingCount}
                </span>
              )}
            </button>

            {/* Protected Faculty Portal Tab */}
            <button
              id="nav-tab-faculty"
              onClick={() => onSelectTab('faculty')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === 'faculty'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200/80'
              }`}
              title={isFaculty ? 'Faculty Management Portal' : 'Faculty Access Required (Protected)'}
            >
              {isFaculty ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-amber-600" />
              )}
              <span>Faculty Portal</span>
              {!isFaculty && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-mono">
                  LOCKED
                </span>
              )}
            </button>

            {/* Protected Admin Portal Tab */}
            <button
              id="nav-tab-admin"
              onClick={() => onSelectTab('admin')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50 border border-purple-200/60'
              }`}
              title={isAdmin ? 'Executive Administration Portal' : 'Admin Access Required (Protected)'}
            >
              <Shield className="w-3.5 h-3.5 text-purple-500" />
              <span>Admin</span>
              {!isAdmin && (
                <Lock className="w-3 h-3 text-purple-400" />
              )}
            </button>
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2.5">
            
            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotifications && (
                <div 
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Security & Activity</span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-semibold bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-3.5 hover:bg-slate-50 transition-colors flex gap-3 ${!n.read ? 'bg-indigo-50/40' : ''}`}
                      >
                        <div className="mt-0.5 shrink-0">
                          {n.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : n.type === 'warning' ? (
                            <Bell className="w-4 h-4 text-amber-500" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-indigo-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800">{n.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 px-4 border-t border-slate-100 text-center">
                    <button 
                      onClick={() => {
                        setShowNotifications(false);
                        onSelectTab('bookings');
                      }}
                      className="text-xs text-slate-600 hover:text-indigo-600 font-medium cursor-pointer"
                    >
                      View all registered activity &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill or Sign In Button */}
            {currentUser ? (
              <div className="relative">
                <div 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1 pl-2 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200/70 transition-all cursor-pointer group"
                  id="navbar-profile-btn"
                  title="View user session details"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-indigo-500/40"
                  />
                  <div className="text-left hidden sm:block">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors truncate max-w-[120px]">
                        {currentUser.name}
                      </span>
                      <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : currentUser.role === 'faculty'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium leading-none truncate max-w-[140px]">
                      {currentUser.role === 'student' && currentUser.studentId ? `Reg. No: ${currentUser.studentId}` : (currentUser.studentId || currentUser.facultyId || currentUser.email)}
                    </div>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                </div>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div 
                    id="profile-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="p-3 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-900">{currentUser.name}</span>
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {currentUser.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</p>
                      {currentUser.role === 'student' && currentUser.studentId && (
                        <p className="text-[11px] text-indigo-600 font-medium mt-0.5">Registration No.: {currentUser.studentId}</p>
                      )}
                      <p className="text-[11px] text-slate-500 mt-0.5">{currentUser.department}</p>
                    </div>

                    <div className="py-1 text-xs font-medium">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onSelectTab('bookings');
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                      >
                        <Ticket className="w-4 h-4 text-indigo-600" />
                        <span>My Passes & Bookings</span>
                      </button>

                      {currentUser.role === 'faculty' && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onSelectTab('faculty');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Faculty Portal</span>
                        </button>
                      )}

                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onSelectTab('admin');
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>Admin Portal</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onOpenLogin();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-indigo-600 font-bold cursor-pointer"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>Switch Account / Test Role</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-rose-50 flex items-center gap-2 text-rose-600 text-xs font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenLogin()}
                id="navbar-signin-btn"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2.5 gap-1.5 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => onSelectTab('discover')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              currentTab === 'discover'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => onSelectTab('workshops')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              currentTab === 'workshops'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Workshops
          </button>
          <button
            onClick={() => onSelectTab('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
              currentTab === 'calendar'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => onSelectTab('bookings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              currentTab === 'bookings'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>My Bookings</span>
            {activeBookingCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold bg-amber-400 text-slate-900 rounded-full">
                {activeBookingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onSelectTab('faculty')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              currentTab === 'faculty'
                ? 'bg-slate-900 text-white'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
            }`}
          >
            {isFaculty ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>Faculty</span>
          </button>
          <button
            onClick={() => onSelectTab('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer flex items-center gap-1 ${
              currentTab === 'admin'
                ? 'bg-purple-900 text-white'
                : 'bg-purple-50 text-purple-800 border border-purple-200/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
};
