import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;
  const { pathname } = url;

  let settings = { 
    maintenanceMode: false, 
    isStoreOpen: true, 
    operatingHours: { open: "09:00", close: "22:00" } 
  };
  
  try {
    const response = await fetch(`${url.origin}/api/settings`, { 
      next: { revalidate: 30 } 
    });
    const data = await response.json();
    if (data.success && data.settings) settings = data.settings;
  } catch (error) {
    console.error("Settings fetch failed in middleware:", error);
  }

  const isAdmin = token?.role === "admin";
  
  // A. Calculate Current Pakistan Time
  const now = new Date();
  const pkTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Karachi",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(now);

  const [currentHour, currentMin] = pkTime.split(":").map(Number);
  const currentTotalMins = currentHour * 60 + currentMin;

  const [openH, openM] = (settings.operatingHours?.open || "09:00").split(":").map(Number);
  const [closeH, closeM] = (settings.operatingHours?.close || "22:00").split(":").map(Number);
  const openTotalMins = openH * 60 + openM;
  const closeTotalMins = closeH * 60 + closeM;

  const isWithinHours = currentTotalMins >= openTotalMins && currentTotalMins < closeTotalMins;
  
  const isTechnicallyOpen = settings.isStoreOpen && isWithinHours;

  if (settings.maintenanceMode && !isAdmin) {
    if (!pathname.startsWith("/admin") && pathname !== "/maintenance" && !pathname.includes(".")) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  // 3. CHECKOUT REDIRECT LOGIC
  if (!isTechnicallyOpen && pathname.startsWith("/checkout") && !isAdmin) {
    return NextResponse.redirect(new URL("/store-closed", request.url));
  }

  // 4. AUTHENTICATION REDIRECT LOGIC
  if (
    token &&
    (pathname.startsWith("/sign-in") ||
      pathname.startsWith("/sign-up") ||
      pathname.startsWith("/verify"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect User Dashboard
  if (!token && pathname.startsWith("/user-dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Staff Authorization
  if (pathname.includes("/staff-console")) {
    const isAuthorized = token?.role === "staff" || token?.role === "admin";
    if (!isAuthorized) return NextResponse.redirect(new URL("/", request.url));
  }

  // Admin Authorization
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
    "/checkout/:path*",
    "/maintenance",
    "/store-closed",
  ],
};