// src/proxy.ts
// EML — Authentication & Route Guard (Next.js 16)
//
// Protects:
//   - All /api/* routes → returns 401 JSON if no valid session
//   - All page routes → redirects to /login if no valid session
//
// Public routes (no auth required) are listed in PUBLIC_ROUTES below.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ---------------------------------------------------------------------------
// Public page routes — accessible without login
// ---------------------------------------------------------------------------
const PUBLIC_PAGE_ROUTES = [
  '/',
  '/login',
  '/register',
  '/signup',
  '/browse',
  '/machinery',
  '/machines',
  '/pricing',
  '/about',
  '/services',
];

// ---------------------------------------------------------------------------
// Public API routes — accessible without login (GET only)
// ---------------------------------------------------------------------------
const PUBLIC_API_ROUTES = [
  '/api/machinery',
];

// ---------------------------------------------------------------------------
// Supabase project reference — used to identify the auth cookie
// ---------------------------------------------------------------------------
const SUPABASE_PROJECT_REF = 'ncmhztlaogviekbfmufc';
const AUTH_COOKIE_NAME     = `sb-${SUPABASE_PROJECT_REF}-auth-token`;

// ---------------------------------------------------------------------------
// Main proxy function (replaces middleware in Next.js 16)
// ---------------------------------------------------------------------------
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Check for valid Supabase session cookie ---
  const authCookie  = request.cookies.get(AUTH_COOKIE_NAME);
  const hasSession  = !!authCookie?.value;

  // -------------------------------------------------------------------------
  // API Route Protection
  // Returns 401 JSON — never redirects API calls to a login page
  // -------------------------------------------------------------------------
  if (pathname.startsWith('/api/')) {
    // Allow public API routes (GET only)
    const isPublicApi = PUBLIC_API_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + '/')
    );
    if (isPublicApi && request.method === 'GET') {
      return NextResponse.next();
    }

    // Require session for all other API calls
    if (!hasSession) {
      return NextResponse.json(
        {
          success: false,
          error:   'Authentication required. Please sign in.',
          code:    'UNAUTHORIZED',
        },
        { status: 401 }
      );
    }

    // Session exists — pass the user token forward as a header
    // Route handlers can read: request.headers.get('x-auth-token')
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-auth-token', authCookie!.value);

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // -------------------------------------------------------------------------
  // Page Route Protection
  // Redirects to /login if no session found
  // -------------------------------------------------------------------------
  const isPublicPage = PUBLIC_PAGE_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(route + '/') ||
      pathname.startsWith('/machinery/') ||
      pathname.startsWith('/machines/')
  );

  if (!isPublicPage && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Matcher — which paths this proxy runs on
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon.ico
     * - public folder files (images, icons, manifest)
     */
    '/((?!_next/static|_next/image|favicon.ico|icon-|logo|manifest|sw.js|OneSignal).*)',
  ],
};