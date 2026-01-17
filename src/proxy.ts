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






// import { NextRequest, NextResponse } from "next/server";
// import { getToken } from "next-auth/jwt";

// // 1. Rename the function from 'middleware' to 'proxy'
// export async function proxy(request: NextRequest) {
//   console.log("Proxy (formerly middleware) is running");
  
//   const token = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });
  
//   const url = request.nextUrl;

//   // Redirect authenticated users away from auth pages
//   if (
//     token &&
//     (url.pathname.startsWith("/sign-in") ||
//       url.pathname.startsWith("/sign-up") ||
//       url.pathname.startsWith("/verify"))
//   ) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Protect dashboard and admin routes from unauthenticated users
//   const protectedPaths = [
//     "/user-dashboard",
//     "/manager-dashboard",
//     "/staff-dashboard",
//     "/admin"
//   ];

//   const isProtectedPath = protectedPaths.some(path => url.pathname.startsWith(path));

//   if (!token && isProtectedPath) {
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // Role-based authorization for Admin
//   if (token && url.pathname.startsWith("/admin")) {
//     if (token.role !== "admin") {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   return NextResponse.next();
// }

// // 2. The config remains the same
// export const config = {
//   matcher: [
//     "/user-dashboard/:path*",
//     "/manager-dashboard/:path*",
//     "/staff-dashboard/:path*",
//     "/admin/:path*",
//     "/sign-in",
//     "/sign-up",
//     "/contact",
//     "/book-a-table",
//     "/verify/:path*",
//   ],
// };