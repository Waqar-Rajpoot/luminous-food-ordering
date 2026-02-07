import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;
  const { pathname } = url;

  // 1. FETCH GLOBAL SETTINGS
  // Default fallback to keep the site safe if DB fetch fails
  let settings = { 
    maintenanceMode: false, 
    isStoreOpen: true, 
    operatingHours: { open: "09:00", close: "22:00" } 
  };
  
  try {
    // Note: Calling an internal API via fetch in middleware can be slow.
    // In production, consider using a direct DB connection if your DB supports Edge (like Mongo Atlas)
    // or a caching layer like Redis for sub-50ms checks.
    const response = await fetch(`${url.origin}/api/settings`, { 
      next: { revalidate: 30 } 
    });
    const data = await response.json();
    if (data.success) settings = data.settings;
  } catch (error) {
    console.error("Settings fetch failed in middleware:", error);
  }

  const isAdmin = token?.role === "admin";

  // --- UNIFIED STORE STATUS LOGIC ---
  
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

  // B. Parse Operating Hours
  const [openH, openM] = settings.operatingHours.open.split(":").map(Number);
  const [closeH, closeM] = settings.operatingHours.close.split(":").map(Number);
  const openTotalMins = openH * 60 + openM;
  const closeTotalMins = closeH * 60 + closeM;

  // C. Determine if Technically Open
  const isWithinHours = currentTotalMins >= openTotalMins && currentTotalMins < closeTotalMins;
  const isTechnicallyOpen = settings.isStoreOpen && isWithinHours;

  // --- NAVIGATION GUARDS ---

  // 2. MAINTENANCE MODE LOGIC (Admin is Immune)
  if (settings.maintenanceMode && !isAdmin) {
    // Allow access ONLY to the maintenance page and static assets
    if (!pathname.startsWith("/admin") && pathname !== "/maintenance" && !pathname.includes(".")) {
      return NextResponse.redirect(new URL("/maintenance", request.url));
    }
  }

  // 3. STORE CLOSED LOGIC
  // Redirect to store-closed if store is manually off or outside hours
  // Only blocks checkout and shop-related paths
  if (!isTechnicallyOpen && pathname.startsWith("/checkout") && !isAdmin) {
    return NextResponse.redirect(new URL("/store-closed", request.url));
  }

  // --- AUTH LOGIC ---
  
  // Redirect logged-in users away from auth pages
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

// Updated Matcher to include the new redirect targets
export const config = {
  matcher: [
    "/admin/:path*",
    "/user-dashboard/:path*",
    "/sign-in",
    "/sign-up",
    "/verify/:path*",
    "/checkout/:path*",
    "/maintenance",   // Added
    "/store-closed",   // Added
  ],
};