import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Key, 
  Lock, 
  Activity, 
  Search, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  Sliders,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { authService } from '../services/authService';
import { User, AuditLog, UserRole } from '../types';

interface AdminPortalViewProps {
  onNotify: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({ onNotify }) => {
  const [overview, setOverview] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'audit'>('users');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewData, usersData, logsData] = await Promise.all([
        authService.getAdminOverview(),
        authService.getAdminUsers(),
        authService.getAdminAuditLogs()
      ]);
      setOverview(overviewData);
      setUsers(usersData.users);
      setAuditLogs(logsData.auditLogs);
    } catch (err: any) {
      onNotify('error', 'Admin Authorization Error', err.message || 'Failed to fetch admin telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingUserId(userId);
    try {
      await authService.updateUserRole(userId, newRole);
      onNotify('success', 'User Role Updated', `Role changed to ${newRole}.`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      fetchData(); // refresh audit logs
    } catch (err: any) {
      onNotify('error', 'Update Failed', err.message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.department.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.role.toLowerCase().includes(searchUser.toLowerCase()) ||
    (u.studentId && u.studentId.toLowerCase().includes(searchUser.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest bg-purple-500/30 text-purple-200 px-2.5 py-0.5 rounded-full border border-purple-400/30">
              Executive Administration
            </span>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Server RBAC Verified
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Campus Access Control & Security Portal
          </h1>
          <p className="text-xs text-slate-300">
            Enforcing server-side authorization boundaries, user credentials, and session auditing.
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Accounts</span>
          <p className="text-2xl font-black text-slate-900">{overview?.totalUsers ?? '—'}</p>
          <p className="text-[11px] text-slate-500 font-medium">Provisioned in database</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">Verified Faculty</span>
          <p className="text-2xl font-black text-indigo-600">{overview?.countsByRole?.faculty ?? '—'}</p>
          <p className="text-[11px] text-slate-500 font-medium">Workshop publishers</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Students</span>
          <p className="text-2xl font-black text-emerald-600">{overview?.countsByRole?.students ?? '—'}</p>
          <p className="text-[11px] text-slate-500 font-medium">Active learners</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">JWT Token Security</span>
          <p className="text-sm font-black text-purple-700 font-mono mt-1">HS256 / 24h</p>
          <p className="text-[11px] text-slate-500 font-medium">Bcrypt password hashing</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Role Authorization Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 flex items-center gap-2 cursor-pointer transition-colors ${
            activeTab === 'audit'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Server Security Audit Logs ({auditLogs.length})</span>
        </button>
      </div>

      {/* Tab 1: User Role Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Table Header Filter */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search user name, Registration No., email, or department..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Showing {filteredUsers.length} university users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 pl-6">User Profile</th>
                  <th className="p-3.5">University Email</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Active Role</th>
                  <th className="p-3.5 pr-6 text-right">Role Authorization Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 pl-6 flex items-center gap-3">
                      <img 
                        src={u.avatar} 
                        alt={u.name}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{u.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {u.role === 'student' && u.studentId ? `Registration No.: ${u.studentId}` : (u.facultyId ? `Faculty ID: ${u.facultyId}` : (u.studentId || u.id))}
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-slate-700">{u.email}</td>
                    
                    <td className="p-3.5 text-slate-600 font-medium">{u.department}</td>

                    <td className="p-3.5">
                      <span className={`px-2.5 py-0.5 rounded-md font-extrabold text-[10px] uppercase ${
                        u.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : u.role === 'faculty' 
                            ? 'bg-indigo-100 text-indigo-800' 
                            : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>

                    <td className="p-3.5 pr-6 text-right">
                      <select
                        disabled={updatingUserId === u.id}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 cursor-pointer focus:outline-none"
                      >
                        <option value="student">Student</option>
                        <option value="faculty">Faculty</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Security Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="font-bold text-xs text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Real-Time Server Access Audit Telemetry
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Capturing 401 Unauthenticated & 403 Forbidden events
            </span>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 px-6 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    log.status === 'SUCCESS' 
                      ? 'bg-emerald-500' 
                      : log.status === 'DENIED' 
                        ? 'bg-rose-500 ring-2 ring-rose-300' 
                        : 'bg-amber-500'
                  }`}></span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                        log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-100 px-1 rounded">
                        {log.resource}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-sans mt-0.5 truncate">
                      User: <strong className="text-slate-700">{log.userEmail}</strong> ({log.userRole}) • IP: {log.ipAddress}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
