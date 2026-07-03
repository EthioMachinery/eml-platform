// src/lib/auth/getSession.ts
// TM — Server-Side Session Helper
//
// Reads the authenticated user's identity from request headers.
// The middleware (src/middleware.ts) validates the session and injects
// these headers before any route handler runs, so this is always safe.
//
// Usage in any route handler:
//   import { getSession } from '@/lib/auth/getSession';
//
//   export async function POST(request: NextRequest) {
//     const session = getSession(request);
//     console.log(session.userId);   // authenticated user's UUID
//     console.log(session.role);     // 'admin' | 'verified_seller' | 'buyer' | 'agent'
//   }

import type { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EmlUserRole = 'admin' | 'verified_seller' | 'buyer' | 'agent' | 'guest';

export interface EmlSession {
  userId: string;
  email: string;
  role: EmlUserRole;
}

// ---------------------------------------------------------------------------
// getSession
//
// Extracts the authenticated user's identity from the request headers
// injected by src/middleware.ts.
//
// Returns an EmlSession object. If the middleware is working correctly,
// these headers will always be present on protected routes.
// ---------------------------------------------------------------------------
export function getSession(request: NextRequest): EmlSession {
  const userId = request.headers.get('x-user-id') ?? '';
  const email  = request.headers.get('x-user-email') ?? '';
  const role   = (request.headers.get('x-user-role') ?? 'buyer') as EmlUserRole;

  return { userId, email, role };
}

// ---------------------------------------------------------------------------
// requireRole
//
// Guards a route to a specific set of allowed roles.
// Returns null if the user has permission, or an error string if not.
//
// Usage:
//   const session = getSession(request);
//   const denied = requireRole(session, ['admin']);
//   if (denied) return errorResponse(denied, 403, 'FORBIDDEN');
// ---------------------------------------------------------------------------
export function requireRole(
  session: EmlSession,
  allowedRoles: EmlUserRole[]
): string | null {
  if (!allowedRoles.includes(session.role)) {
    return `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${session.role}.`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// isAdmin
//
// Simple convenience check for admin-only routes.
//
// Usage:
//   if (!isAdmin(session)) return errorResponse('Admins only.', 403, 'FORBIDDEN');
// ---------------------------------------------------------------------------
export function isAdmin(session: EmlSession): boolean {
  return session.role === 'admin';
}