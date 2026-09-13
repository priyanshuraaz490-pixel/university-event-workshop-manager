import React from 'react';
import { ShieldAlert, Lock, ArrowRight, ArrowLeft, Building2, User, KeyRound } from 'lucide-react';
import { User as UserType, UserRole } from '../types';

interface AccessDeniedViewProps {
  requiredRole: 'faculty' | 'admin' | 'student';
  currentUser: UserType | null;
  onOpenLogin: (role: 'faculty' | 'admin' | 'student') => void;
  onGoBack: () => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  requiredRole,
  currentUser,
  onOpenLogin,
  onGoBack
}) => {
  const roleTitle = requiredRole === 'faculty' 
    ? 'Faculty Portal' 
    : requiredRole === 'admin' 
      ? 'Executive Admin Portal' 
      : 'Student Portal';

  const requiredDescription = requiredRole === 'faculty'
    ? 'Access to workshop creation, capacity adjustments, student attendance rosters, and transcript credit approvals is strictly restricted to verified university faculty and department instructors.'
    : requiredRole === 'admin'
      ? 'Access to system-wide security audit logs, user role assignments, and campus administrative configurations is restricted to authorized campus system administrators.'
      : 'Access to personal event registrations and digital passes requires an active student login session.';

  return (
    <div className="py-12 max-w-xl mx-auto animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden text-center">
        
        {/* Top Warning Banner */}
        <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 p-8 text-white relative">
          <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full inline-block mb-2">
            HTTP 403 • Role-Based Access Control
          </span>
          <h2 className="text-2xl font-black tracking-tight text-white">
            {roleTitle} Access Restricted
          </h2>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            {requiredDescription}
          </p>

          {/* Current Session Inspection Badge */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Active Session Status
            </span>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-sm truncate">{currentUser.name}</p>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      currentUser.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700' 
                        : currentUser.role === 'faculty' 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
                <ShieldAlert className="w-4 h-4" />
                <span>Unauthenticated session: No valid credentials supplied.</span>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            <button
              onClick={() => onOpenLogin(requiredRole)}
              id="access-denied-login-btn"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>
                {currentUser 
                  ? `Switch to ${requiredRole.toUpperCase()} Account` 
                  : `Sign In with ${requiredRole.toUpperCase()} Credentials`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoBack}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Public Events Catalog</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
