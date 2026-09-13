import { User, AuthResponse, AuditLog } from '../types';

const TOKEN_KEY = 'unievent_auth_token';
const USER_KEY = 'unievent_auth_user';

export const authService = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setSession(token: string, user: User) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser(): User | null {
    const saved = localStorage.getItem(USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    this.setSession(data.token, data.user);
    return data;
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: 'student' | 'faculty';
    department: string;
    studentId?: string;
    facultyId?: string;
    yearOfStudy?: string;
  }): Promise<AuthResponse> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    this.setSession(data.token, data.user);
    return data;
  },

  async verifyFacultySession(): Promise<{ authorized: boolean; user?: any; error?: string }> {
    const token = this.getToken();
    if (!token) {
      return { authorized: false, error: 'No active session token found' };
    }

    try {
      const res = await fetch('/api/faculty/verify-session', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        return { authorized: false, error: data.error || 'Access denied' };
      }
      return { authorized: true, user: data.user };
    } catch (err: any) {
      return { authorized: false, error: err.message };
    }
  },

  async verifyAdminSession(): Promise<{ authorized: boolean; user?: any; error?: string }> {
    const token = this.getToken();
    if (!token) {
      return { authorized: false, error: 'No active session token found' };
    }

    try {
      const res = await fetch('/api/admin/verify-session', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        return { authorized: false, error: data.error || 'Access denied' };
      }
      return { authorized: true, user: data.user };
    } catch (err: any) {
      return { authorized: false, error: err.message };
    }
  },

  async verifyStudentSession(): Promise<{ authorized: boolean; user?: any; error?: string }> {
    const token = this.getToken();
    if (!token) {
      return { authorized: false, error: 'No active session token found' };
    }

    try {
      const res = await fetch('/api/student/verify-session', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) {
        return { authorized: false, error: data.error || 'Access denied' };
      }
      return { authorized: true, user: data.user };
    } catch (err: any) {
      return { authorized: false, error: err.message };
    }
  },

  async getDemoCredentials(): Promise<{ accounts: any[] }> {
    const res = await fetch('/api/auth/demo-credentials');
    return await res.json();
  },

  async getAdminOverview(): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/overview', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  async getAdminUsers(): Promise<{ users: User[] }> {
    const token = this.getToken();
    const res = await fetch('/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  },

  async updateUserRole(userId: string, role: string): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ role })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update role');
    }
    return await res.json();
  },

  async getAdminAuditLogs(): Promise<{ auditLogs: AuditLog[] }> {
    const token = this.getToken();
    const res = await fetch('/api/admin/audit-logs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Unauthorized');
    return await res.json();
  }
};
