# ============================================================================
# TM Auth Fix — deployment script (Option B: proper @supabase/ssr migration)
# Run from C:\tm-next in PowerShell with:
#   powershell -ExecutionPolicy Bypass -File deploy_auth_fix.ps1
# Writes middleware.ts and src/lib/supabaseClient.ts as UTF-8 WITHOUT a BOM.
# Safe to re-run.
# ============================================================================

$ErrorActionPreference = "Stop"
$Utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Write-TmFile($RelativePath, $Content) {
    $full = Join-Path (Get-Location) $RelativePath
    $dir = Split-Path $full -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($full, $Content, $Utf8NoBom)
    Write-Host "Wrote $RelativePath"
}

$f1 = @'
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * TM SECURITY MIDDLEWARE
 * - Protects dashboard, admin, and API routes
 * - Injects security headers on every response
 * - Rate-limit hint headers for edge enforcement
 *
 * FIXED (auth session bug): this previously checked for a cookie named
 * like "sb-*-auth-token" by hand, but the Supabase client only ever stored
 * the session in localStorage — so that cookie never existed and every
 * protected route redirected back to /login even right after a successful
 * sign-in. This now uses @supabase/ssr's createServerClient +
 * supabase.auth.getUser() to properly validate the session via the cookies
 * that the browser client (src/lib/supabaseClient.ts) now writes.
 *
 * Uses the modern getAll/setAll cookie API (not the deprecated single-cookie
 * get/set/remove API), since getAll/setAll correctly reconstructs a session
 * cookie that Supabase has split into multiple chunks for large tokens — a
 * case the deprecated API can silently mishandle.
 *
 * Note: admin-vs-non-admin role checking is intentionally NOT done here.
 * This project stores the role on public.profiles.role, not in the auth
 * JWT's app_metadata, so it can't be reliably checked from middleware
 * alone. Each admin page already does its own role check server/client
 * side by querying profiles after confirming the user is logged in.
 */

const PROTECTED_PREFIXES = ["/dashboard", "/admin", "/founder-admin"];
const API_PROTECTED = ["/api/deals", "/api/escrow", "/api/payments", "/api/wallet", "/api/smart-match", "/api/smart-pricing"];

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // response gets reassigned inside the cookie handlers below whenever
  // Supabase needs to refresh/rewrite the session cookies.
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Validates the session with the auth server (not just reading a cookie
  // blindly) and refreshes it via the handlers above if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  addSecurityHeaders(response);

  // ── AUTH GATE for dashboard/admin routes ────────────────────────
  const isProtectedPage = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isProtectedAPI = API_PROTECTED.some((p) => pathname.startsWith(p));

  if (isProtectedPage && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isProtectedAPI && !user) {
    return NextResponse.json(
      { success: false, error: "Valid session required", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  // Admin-only pages: role is checked page-side against public.profiles.
  // Middleware just adds a hint header for tracing.
  if (pathname.startsWith("/admin") || pathname.startsWith("/founder-admin")) {
    response.headers.set("X-TM-Route-Type", "admin");
  }

  // ── INJECT USER CONTEXT HEADERS for API routes ──────────────────
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

'@
Write-TmFile "middleware.ts" $f1

$f2 = @'
import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and/or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
    "The app cannot connect to the database without these. Check your .env.local or deployment environment settings."
  );
}

/**
 * This file is imported both by browser ("use client") components and by
 * server-side API route handlers (src/app/api/**), so it must work in both
 * environments:
 *
 * - In the browser: createBrowserClient from @supabase/ssr stores the
 *   session in cookies (readable by middleware.ts on every subsequent
 *   request) instead of localStorage, which is invisible to the server.
 *   This is what makes /dashboard, /admin, and /founder-admin correctly
 *   recognize a logged-in user instead of bouncing back to /login.
 * - On the server (API routes): createBrowserClient depends on
 *   `document`/`window`, which don't exist there, so we fall back to the
 *   plain @supabase/supabase-js client exactly as before. API routes in
 *   this project don't rely on supabase.auth session state from this
 *   client, so this fallback preserves their existing behavior unchanged.
 */
export const supabase =
  typeof window !== "undefined"
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : createClient(supabaseUrl, supabaseAnonKey);
'@
Write-TmFile "src/lib/supabaseClient.ts" $f2

Write-Host ""
Write-Host "Auth fix files written (UTF-8, no BOM). Run: git status" -ForegroundColor Green
