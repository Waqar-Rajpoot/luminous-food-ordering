import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;
  const { pathname } = url;

  if (
    token &&
    (pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token && pathname.startsWith("/user-dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname.includes("/staff-console")) {
    const isAuthorized = token?.role === "staff" || token?.role === "admin";
    
    if (!isAuthorized) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/admin")) {
    if (!token || token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user-dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
  ],
};