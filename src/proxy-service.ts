// src/proxy.ts
// TM — Enterprise-Grade Authentication & Route Guard
// Optimized for Global Industrial Security Standards

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

// ---------------------------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------------------------
const PUBLIC_PAGE_ROUTES = ['/', '/login', '/register', '/signup', '/browse', '/machinery', '/machines', '/pricing', '/about', '/services'];
const PUBLIC_API_ROUTES = ['/api/machinery'];
const ADMIN_PREFIXES = ['/admin', '/ceo', '/founder-admin', '/api/admin'];

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // 1. INITIALIZE SUPABASE CLIENT (Verify Token Authenticity)
  // Using @supabase/ssr ensures we aren't just checking for a cookie's existence,
  // but validating that the session is real and not expired.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // 2. API PROTECTION
  if (pathname.startsWith('/api/')) {
    const isPublicApi = PUBLIC_API_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'));
    
    if (isPublicApi && request.method === 'GET') {
      return response;
    }

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Valid session required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }
  }

  // 3. ROLE-BASED ACCESS CONTROL (RBAC) - Critical for Top 10 Status
  // Prevents unauthorized users from accessing the CEO Command Center or Admin APIs
  const isInternalRoute = ADMIN_PREFIXES.some(prefix => pathname.startsWith(prefix));
  
  if (isInternalRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=' + pathname, request.url));
    }

    // SMART FEATURE: Check the role claim in the JWT metadata
    const userRole = user.app_metadata?.role || 'user';
    const isAdmin = userRole === 'admin' || userRole === 'super_admin' || user.email?.endsWith('@trustworthymachinery.com');

    if (!isAdmin) {
      // Redirect unauthorized users to their dashboard, not login
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 4. PUBLIC ROUTE REDIRECT
  const isPublicPage = PUBLIC_PAGE_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  if (!isPublicPage && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. SECURITY HARDENING HEADERS
  // Adds a layer of industrial-grade protection to every request
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon-|logo|manifest|sw.js|OneSignal).*)',
  ],
};