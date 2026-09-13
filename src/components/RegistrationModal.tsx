import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Ticket, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';
import { UniEvent, User } from '../types';
import { CURRENT_STUDENT } from '../data/initialEvents';

interface RegistrationModalProps {
  event: UniEvent | null;
  currentUser?: User | null;
  onClose: () => void;
  onConfirmRegistration: (
    event: UniEvent, 
    details: {
      studentName: string;
      studentEmail: string;
      studentId: string;
      department: string;
      yearOfStudy: string;
      specialRequirements?: string;
    }
  ) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  currentUser,
  onClose,
  onConfirmRegistration
}) => {
  if (!event) return null;

  const [formData, setFormData] = useState({
    studentName: currentUser?.name || CURRENT_STUDENT.name,
    studentEmail: currentUser?.email || CURRENT_STUDENT.email,
    studentId: currentUser?.studentId || CURRENT_STUDENT.studentId,
    department: currentUser?.department || CURRENT_STUDENT.department,
    yearOfStudy: currentUser?.yearOfStudy || CURRENT_STUDENT.yearOfStudy,
    specialRequirements: '',
    agreeToCodeOfConduct: true
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToCodeOfConduct) {
      setError('Please acknowledge the university attendance code of conduct.');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      onConfirmRegistration(event, {
        studentName: formData.studentName,
        studentEmail: formData.studentEmail,
        studentId: formData.studentId,
        department: formData.department,
        yearOfStudy: formData.yearOfStudy,
        specialRequirements: formData.specialRequirements
      });
      setSubmitting(false);
    }, 300);
  };

  return (
    <div 
      id="registration-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div 
        id="registration-modal-content"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col overflow-hidden my-auto animate-in zoom-in-95 duration-150"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/70 to-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Confirm Event Registration</h3>
              <p className="text-xs text-slate-500">Digital seat pass will be generated instantly.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          
          {/* Target Event Summary Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Selected Session</span>
            <h4 className="font-bold text-sm text-slate-900 leading-tight">{event.title}</h4>
            <div className="flex flex-wrap items-center gap-3 text-slate-500 text-xs pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                {event.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {event.startTime} - {event.endTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 truncate max-w-[180px]">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {event.venue}
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Profile Info */}
          <div className="space-y-3 pt-1">
            <h5 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Attendee Student Credentials</h5>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Student ID Number</label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-600 block">University Email Address</label>
              <input
                type="email"
                required
                value={formData.studentEmail}
                onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Academic Department</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block">Year of Study</label>
                <input
                  type="text"
                  value={formData.yearOfStudy}
                  onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Special Requirements */}
            <div className="space-y-1 pt-1">
              <label className="font-semibold text-slate-600 block">
                Accessibility, Dietary, or Technical Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Wheelchair access needed, or dietary allergy"
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToCodeOfConduct}
                  onChange={(e) => setFormData({ ...formData, agreeToCodeOfConduct: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 mt-0.5"
                />
                <span className="text-[11px] leading-relaxed">
                  I agree to the university event attendance policy and understand that seats are reserved exclusively for registered students.
                </span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="confirm-registration-submit-btn"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{submitting ? 'Generating Ticket...' : 'Confirm & Generate Pass'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
