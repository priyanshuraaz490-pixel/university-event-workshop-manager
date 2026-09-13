import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  Building2, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { authService } from '../services/authService';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
  requiredRole?: 'faculty' | 'admin' | 'student';
  noticeMessage?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  requiredRole,
  noticeMessage
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [department, setDepartment] = useState('Computer Science');
  const [studentId, setStudentId] = useState('');
  const [facultyId, setFacultyId] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await authService.register({
          name,
          email,
          password,
          role,
          department,
          studentId: role === 'student' ? studentId : undefined,
          facultyId: role === 'faculty' ? facultyId : undefined
        });
        onSuccess(res.user);
        onClose();
      } else {
        const res = await authService.login(email, password);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setError('');
    setLoading(true);
    try {
      const res = await authService.login(demoEmail, demoPass);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
    >
      <div 
        id="auth-modal-content"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden my-auto animate-in zoom-in-95 duration-150"
      >
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6 text-indigo-300" />
          </div>

          <h3 className="text-xl font-black tracking-tight text-white">
            {isRegister ? 'University Account Registration' : 'Campus Single Sign-On'}
          </h3>
          <p className="text-xs text-indigo-200 mt-1">
            {noticeMessage || (
              requiredRole === 'faculty'
                ? 'Faculty credentials required to access the Faculty Portal.'
                : requiredRole === 'admin'
                  ? 'Administrator credentials required to access the Admin Portal.'
                  : 'Authenticate to access personalized university passes and bookings.'
            )}
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-white/10 p-1 rounded-xl mt-4 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => { setIsRegister(false); setError(''); }}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                !isRegister ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-200 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsRegister(true); setError(''); }}
              className={`flex-1 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                isRegister ? 'bg-white text-indigo-950 shadow-sm' : 'text-indigo-200 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {isRegister && (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Alex Vance"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${
                        role === 'student' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Student</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('faculty')}
                      className={`p-2 rounded-xl border flex items-center justify-center gap-2 font-bold cursor-pointer transition-all ${
                        role === 'faculty' 
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Faculty</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Computer Science"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      {role === 'faculty' ? 'Faculty ID' : 'Student ID'}
                    </label>
                    <input
                      type="text"
                      value={role === 'faculty' ? facultyId : studentId}
                      onChange={(e) => role === 'faculty' ? setFacultyId(e.target.value) : setStudentId(e.target.value)}
                      placeholder={role === 'faculty' ? 'FAC-809' : 'UE-94820'}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">University Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              id="auth-submit-btn"
              className="w-full mt-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Verifying with Server...' : isRegister ? 'Complete Registration' : 'Sign In to Campus'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Quick Test Credentials (One-Click)</span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('faculty@university.edu', 'Faculty@2026')}
                className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-950 font-bold transition-all text-center cursor-pointer"
              >
                <span className="block text-[10px] text-indigo-600 uppercase font-mono">Faculty</span>
                <span className="truncate block">Dr. Elena</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('student@university.edu', 'Student@2026')}
                className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-950 font-bold transition-all text-center cursor-pointer"
              >
                <span className="block text-[10px] text-emerald-600 uppercase font-mono">Student</span>
                <span className="truncate block">Alex R.</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin@university.edu', 'Admin@2026')}
                className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-950 font-bold transition-all text-center cursor-pointer"
              >
                <span className="block text-[10px] text-purple-600 uppercase font-mono">Admin</span>
                <span className="truncate block">Dean Marcus</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
