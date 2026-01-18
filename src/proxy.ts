import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  console.log("middleware is running");
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/verify/:path*"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !token &&
    (url.pathname.startsWith("/user-dashboard") ||
      url.pathname.startsWith("/manager-dashboard") ||
      url.pathname.startsWith("/staff-dashboard") ||
      url.pathname.startsWith("/user-dashboard/:path*") ||
      url.pathname.startsWith("/manager-dashboard/:path*") ||
      url.pathname.startsWith("/staff-dashboard/:path*") ||
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/admin/:path*"))
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (token && url.pathname.startsWith("/admin")) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/sign-in",
    "/sign-up",
    "/contact",
    "/book-a-table",
    "/verify/:path*",
  ],
};
