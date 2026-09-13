export type EventCategory = 
  | 'All'
  | 'Technology & AI'
  | 'Hands-on Workshops'
  | 'Career & Industry'
  | 'Academic & Research'
  | 'Cultural & Arts'
  | 'Student Clubs & Sports';

export type EventFormat = 'In-Person' | 'Virtual' | 'Hybrid';

export type EventLevel = 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';

export interface EventAgendaItem {
  time: string;
  title: string;
  description: string;
}

export interface UniEvent {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: EventCategory;
  format: EventFormat;
  level: EventLevel;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM AM/PM
  endTime: string;
  venue: string;
  room?: string;
  virtualLink?: string;
  speaker: {
    name: string;
    role: string;
    department: string;
    avatar: string;
    bio?: string;
  };
  capacity: number;
  registeredCount: number;
  credits: number;
  isFree: boolean;
  price?: number;
  certificateProvided: boolean;
  prerequisites: string[];
  materialsProvided: string[];
  agenda: EventAgendaItem[];
  coverImage: string;
  featured?: boolean;
  tags: string[];
  organizer: string;
  status: 'Open' | 'Few Seats Left' | 'Waitlist' | 'Completed' | 'Cancelled';
}

export interface Booking {
  id: string;
  ticketNumber: string;
  eventId: string;
  eventTitle: string;
  eventCategory: EventCategory;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventFormat: EventFormat;
  coverImage: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  department: string;
  yearOfStudy: string;
  bookingDate: string;
  status: 'Confirmed' | 'Waitlisted' | 'Checked In' | 'Cancelled';
  qrCodeUrl: string;
  specialRequirements?: string;
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  registeredAt: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export type UserRole = 'student' | 'faculty' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  studentId?: string;
  facultyId?: string;
  title?: string;
  avatar: string;
  academicCredits?: number;
  yearOfStudy?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: UserRole;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  ipAddress?: string;
}
