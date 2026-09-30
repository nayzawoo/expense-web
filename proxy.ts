import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_HINT_COOKIE } from "@/lib/api/client";

const protectedPaths = [
  "/dashboard",
  "/users",
  "/categories",
  "/accounts",
  "/settings",
  "/transfers",
  "/expenses",
  "/incomes",
  "/analytics",
];
const guestOnlyPaths = ["/login"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated =
    request.cookies.get(AUTH_HINT_COOKIE)?.value === "1";
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isGuestOnly = guestOnlyPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isGuestOnly && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/users/:path*",
    "/categories/:path*",
    "/accounts/:path*",
    "/settings/:path*",
    "/transfers/:path*",
    "/expenses/:path*",
    "/incomes/:path*",
    "/analytics/:path*",
    "/login",
  ],
};
