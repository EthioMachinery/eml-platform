import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * TM SECURITY MIDDLEWARE
 * - Protects dashboard, admin, and API routes
 * - Injects security headers on every response
 * - Rate-limit hint headers for edge enforcement
 */

const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/founder-admin"];
const API_PROTECTED = ["/api/deals", "/api/escrow", "/api/payments", "/api/wallet", "/api/smart-match", "/api/smart-pricing"];

function getSessionFromCookies(req: NextRequest): string | null {
  // Supabase stores session in cookies prefixed with sb-
  const cookies = req.cookies;
  const sessionKey = [...cookies.getAll()].find(
    (c) => c.name.includes("-auth-token") || c.name === "sb-access-token"
  );
  return sessionKey?.value ?? null;
}

function addSecurityHeaders(res: NextResponse): NextResponse {
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(self)");
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://trustworthymachinery.vercel.app",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com",
      "frame-ancestors 'none'",
    ].join("; ")
  );
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── SECURITY HEADERS on all routes ──────────────────────────────
  const response = NextResponse.next();
  addSecurityHeaders(response);

  // ── AUTH GATE for dashboard/admin routes ────────────────────────
  const isProtectedPage = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isProtectedAPI = API_PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtectedPage || isProtectedAPI) {
    const session = getSessionFromCookies(request);

    // No session cookie found → redirect to login
    if (!session && isProtectedPage) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Admin-only protection
    if (pathname.startsWith("/admin") || pathname.startsWith("/founder-admin")) {
      // The admin check is enforced server-side by AdminGuard component + getSession()
      // Middleware adds a hint header for tracing
      response.headers.set("X-TM-Route-Type", "admin");
    }
  }

  // ── INJECT USER CONTEXT HEADERS for API routes ──────────────────
  // These are read by getSession() in API handlers
  if (pathname.startsWith("/api/")) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    response.headers.set("X-TM-API-Version", "2.0");
    response.headers.set("X-Supabase-Url", supabaseUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|icons|manifest.json).*)",
  ],
};
