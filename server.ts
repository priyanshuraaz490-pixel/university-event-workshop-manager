import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'unievent_campus_portal_jwt_secret_fall_2026';
const SESSION_EXPIRY = process.env.SESSION_EXPIRY || '24h';

app.use(express.json());

// In-Memory Database Store for Applet Session
interface StoredUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
  studentId?: string;
  facultyId?: string;
  avatar: string;
  yearOfStudy?: string;
  academicCredits?: number;
  createdAt: string;
}

interface StoredAuditLog {
  id: string;
  timestamp: string;
  userEmail: string;
  userRole: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  ipAddress: string;
  details?: string;
}

// Seed Users with strong bcrypt hashed passwords (salts: 10)
const users: StoredUser[] = [
  {
    id: 'usr-student-1',
    email: 'student@university.edu',
    name: 'Alex Rivera',
    passwordHash: bcrypt.hashSync('Student@2026', 10),
    role: 'student',
    department: 'Computer Science',
    studentId: 'UE-84920',
    yearOfStudy: 'Junior (3rd Year)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    academicCredits: 14,
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    id: 'usr-faculty-1',
    email: 'faculty@university.edu',
    name: 'Dr. Elena Rostova',
    passwordHash: bcrypt.hashSync('Faculty@2026', 10),
    role: 'faculty',
    department: 'Department of Computer Science',
    facultyId: 'FAC-CS-402',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-15T09:30:00Z'
  },
  {
    id: 'usr-admin-1',
    email: 'admin@university.edu',
    name: 'Dean Marcus Sterling',
    passwordHash: bcrypt.hashSync('Admin@2026', 10),
    role: 'admin',
    department: 'Office of Academic Affairs & Administration',
    facultyId: 'ADM-EXEC-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2026-08-01T08:00:00Z'
  }
];

// Audit Log Store
const auditLogs: StoredAuditLog[] = [
  {
    id: 'log-seed-1',
    timestamp: new Date().toISOString(),
    userEmail: 'system',
    userRole: 'admin',
    action: 'SERVER_BOOT_SECURITY_INITIALIZED',
    resource: '/api/auth',
    status: 'SUCCESS',
    ipAddress: '127.0.0.1',
    details: 'Role-based access control and bcrypt authentication initialized.'
  }
];

function logAudit(
  userEmail: string,
  userRole: string,
  action: string,
  resource: string,
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED',
  ipAddress: string,
  details?: string
) {
  const log: StoredAuditLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    userEmail,
    userRole,
    action,
    resource,
    status,
    ipAddress,
    details
  };
  auditLogs.unshift(log);
  if (auditLogs.length > 200) auditLogs.pop();
}

// -------------------------------------------------------------
// Authentication & Role Authorization Middleware
// -------------------------------------------------------------

export function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const ip = req.ip || req.connection.remoteAddress || 'unknown';

  if (!token) {
    logAudit('anonymous', 'unauthenticated', 'AUTH_MISSING_TOKEN', req.originalUrl, 'DENIED', ip, 'Missing Authorization header');
    return res.status(401).json({
      error: 'Authentication required. Please sign in to access this resource.',
      code: 'UNAUTHENTICATED'
    });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      logAudit('expired_or_invalid', 'unauthenticated', 'AUTH_INVALID_TOKEN', req.originalUrl, 'DENIED', ip, err.message);
      return res.status(401).json({
        error: 'Your session has expired or is invalid. Please log in again.',
        code: 'TOKEN_INVALID'
      });
    }
    req.user = decoded;
    next();
  });
}

export function requireRole(allowedRoles: ('student' | 'faculty' | 'admin')[]) {
  return (req: any, res: any, next: any) => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const userRole = req.user?.role;
    const userEmail = req.user?.email || 'unknown';

    if (!userRole || !allowedRoles.includes(userRole)) {
      logAudit(
        userEmail,
        userRole || 'unknown',
        `FORBIDDEN_ROLE_ACCESS`,
        req.originalUrl,
        'DENIED',
        ip,
        `User role '${userRole}' attempted access to protected endpoint requiring [${allowedRoles.join(', ')}]`
      );

      return res.status(403).json({
        error: `Access Denied: You do not have permission to access this resource. Requires role: ${allowedRoles.join(' or ')}.`,
        code: 'FORBIDDEN',
        userRole,
        requiredRoles: allowedRoles
      });
    }

    logAudit(userEmail, userRole, `AUTHORIZED_ACCESS`, req.originalUrl, 'SUCCESS', ip);
    next();
  };
}

// Helper: Sanitize User (strip passwordHash)
function sanitizeUser(u: StoredUser) {
  const { passwordHash, ...rest } = u;
  return rest;
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, department, studentId, facultyId, yearOfStudy } = req.body;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required.' });
    }

    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified. Must be 'student' or 'faculty'." });
    }

    // Role protection: Admin role cannot be self-registered without pre-existing admin authorization
    if (role === 'admin') {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      let isAdmin = false;
      if (token) {
        try {
          const decoded = jwt.verify(token, JWT_SECRET) as any;
          if (decoded.role === 'admin') isAdmin = true;
        } catch (_) {}
      }
      if (!isAdmin) {
        logAudit(email, 'anonymous', 'ADMIN_SELF_REGISTRATION_BLOCKED', '/api/auth/register', 'DENIED', ip);
        return res.status(403).json({ error: 'Administrator accounts cannot be self-registered. Contact IT Dean.' });
      }
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this university email already exists.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: StoredUser = {
      id: `usr-${role}-${Date.now()}`,
      email: normalizedEmail,
      name: name.trim(),
      passwordHash,
      role,
      department: department || 'General Studies',
      studentId: role === 'student' ? (studentId || `UE-${Math.floor(10000 + Math.random() * 90000)}`) : undefined,
      facultyId: role === 'faculty' ? (facultyId || `FAC-${Math.floor(100 + Math.random() * 900)}`) : undefined,
      yearOfStudy: role === 'student' ? (yearOfStudy || '1st Year') : undefined,
      avatar: role === 'faculty' 
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      academicCredits: role === 'student' ? 0 : undefined,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: SESSION_EXPIRY as any }
    );

    logAudit(newUser.email, newUser.role, 'USER_REGISTERED', '/api/auth/register', 'SUCCESS', ip);

    res.status(201).json({
      user: sanitizeUser(newUser),
      token
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal registration error', details: err.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip || req.connection.remoteAddress || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      logAudit(normalizedEmail, 'unknown', 'LOGIN_FAILED_USER_NOT_FOUND', '/api/auth/login', 'DENIED', ip);
      return res.status(401).json({ error: 'Invalid university email or password.' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      logAudit(user.email, user.role, 'LOGIN_FAILED_BAD_PASSWORD', '/api/auth/login', 'DENIED', ip);
      return res.status(401).json({ error: 'Invalid university email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: SESSION_EXPIRY as any }
    );

    logAudit(user.email, user.role, 'LOGIN_SUCCESS', '/api/auth/login', 'SUCCESS', ip);

    res.json({
      user: sanitizeUser(user),
      token
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Internal login error', details: err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticateToken, (req: any, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }
  res.json({ user: sanitizeUser(user) });
});

// GET /api/auth/demo-credentials
// Provides verified credentials for testing roles without hardcoding in the client UI
app.get('/api/auth/demo-credentials', (req, res) => {
  res.json({
    accounts: [
      {
        role: 'student',
        email: 'student@university.edu',
        password: 'Student@2026',
        name: 'Alex Rivera',
        description: 'Student with active workshop bookings and activity credits'
      },
      {
        role: 'faculty',
        email: 'faculty@university.edu',
        password: 'Faculty@2026',
        name: 'Dr. Elena Rostova',
        description: 'Faculty instructor with workshop publishing & roster check-in permissions'
      },
      {
        role: 'admin',
        email: 'admin@university.edu',
        password: 'Admin@2026',
        name: 'Dean Marcus Sterling',
        description: 'Academic administrator with full portal audit & role management authority'
      }
    ]
  });
});

// -------------------------------------------------------------
// Protected Faculty Endpoints (Strictly faculty or admin only)
// -------------------------------------------------------------

// GET /api/faculty/dashboard-stats
app.get('/api/faculty/dashboard-stats', authenticateToken, requireRole(['faculty', 'admin']), (req: any, res) => {
  res.json({
    managedEventsCount: 8,
    totalRegistrations: 748,
    averageAttendanceRate: 92.4,
    creditsAwarded: 1496,
    facultyName: req.user.name,
    role: req.user.role,
    status: 'ACTIVE_CREDENTIALED'
  });
});

// POST /api/faculty/verify-session
// Endpoint used by frontend route guard to verify faculty credentials on the server
app.get('/api/faculty/verify-session', authenticateToken, requireRole(['faculty', 'admin']), (req: any, res) => {
  res.json({
    authorized: true,
    user: req.user,
    message: 'Faculty session verified successfully.'
  });
});

// -------------------------------------------------------------
// Protected Admin Endpoints (Strictly admin only)
// -------------------------------------------------------------

// GET /api/admin/verify-session
app.get('/api/admin/verify-session', authenticateToken, requireRole(['admin']), (req: any, res) => {
  res.json({
    authorized: true,
    user: req.user,
    message: 'Admin session verified successfully.'
  });
});

// GET /api/admin/overview
app.get('/api/admin/overview', authenticateToken, requireRole(['admin']), (req: any, res) => {
  const studentsCount = users.filter(u => u.role === 'student').length;
  const facultyCount = users.filter(u => u.role === 'faculty').length;
  const adminCount = users.filter(u => u.role === 'admin').length;

  res.json({
    totalUsers: users.length,
    countsByRole: {
      students: studentsCount,
      faculty: facultyCount,
      admins: adminCount
    },
    securityStatus: 'ALL_RBAC_POLICIES_ACTIVE',
    activeSessions: 12,
    jwtAlgorithm: 'HS256',
    tokenExpiry: SESSION_EXPIRY
  });
});

// GET /api/admin/users
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), (req, res) => {
  res.json({ users: users.map(sanitizeUser) });
});

// PUT /api/admin/users/:id/role
app.put('/api/admin/users/:id/role', authenticateToken, requireRole(['admin']), (req: any, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const ip = req.ip || req.connection.remoteAddress || 'unknown';

  if (!['student', 'faculty', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified.' });
  }

  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const oldRole = user.role;
  user.role = role;

  logAudit(
    req.user.email,
    req.user.role,
    'USER_ROLE_MODIFIED',
    `/api/admin/users/${id}/role`,
    'SUCCESS',
    ip,
    `Admin changed role of ${user.email} from ${oldRole} to ${role}`
  );

  res.json({
    message: `User ${user.email} role updated to ${role}.`,
    user: sanitizeUser(user)
  });
});

// GET /api/admin/audit-logs
app.get('/api/admin/audit-logs', authenticateToken, requireRole(['admin']), (req, res) => {
  res.json({ auditLogs });
});

// -------------------------------------------------------------
// Protected Student Endpoints (Students, Faculty, Admin personal passes)
// -------------------------------------------------------------

// GET /api/student/verify-session
app.get('/api/student/verify-session', authenticateToken, (req: any, res) => {
  res.json({
    authorized: true,
    user: req.user,
    message: 'Student session verified successfully.'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'UniEvent Academic Portal Server',
    authSystem: 'JWT + bcrypt + RBAC'
  });
});

// -------------------------------------------------------------
// Vite Middleware & Static Serving
// -------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniEvent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
