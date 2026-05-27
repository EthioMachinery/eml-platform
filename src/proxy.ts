import { NextResponse }
from "next/server";

import type { NextRequest }
from "next/server";

export function proxy(
  request: NextRequest
) {

  const protectedRoutes = [
    "/seller",
    "/dashboard",
    "/wallet",
    "/payments",
  ];

  const isProtected =
    protectedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(
        route
      )
    );

  const token =
    request.cookies.get(
      "sb-access-token"
    );

  if (
    isProtected &&
    !token
  ) {

    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/seller/:path*",
    "/dashboard/:path*",
    "/wallet/:path*",
    "/payments/:path*",
  ],
};