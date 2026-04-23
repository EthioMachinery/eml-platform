import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // 🚫 BLOCK ANY REDIRECT TO LOGIN OR PORTAL
  if (url.pathname === "/" || url.pathname === "/home") {
    return NextResponse.next();
  }

  // Allow everything else normally
  return NextResponse.next();
}

// Apply to all routes
export const config = {
  matcher: "/:path*",
};