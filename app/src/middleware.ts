import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Added NextRequest type for clarity

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  // 1️⃣A Allow public authentication routes
  if (path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 1️⃣B ✅ NEW: Allow all explicitly public API routes (e.g., /api/public/trips/*)
  if (path.startsWith("/api/public/")) {
    return NextResponse.next();
  }

  // 2️⃣ Get session cookie or Authorization header
  const cookieHeader = req.headers.get("cookie");
  let sessionId = null;

  if (cookieHeader) {
    const match = cookieHeader.match(/auth_session=([^;]+)/);
    sessionId = match ? match[1] : null;
  }

  // Fallback: check Authorization header (Bearer token)
  if (!sessionId) {
    const authHeader = req.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      sessionId = authHeader.substring(7);
    }
  }

  // 3️⃣ If no session token found, return 401
  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 4️⃣ Pass the session ID to the API route via header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-session-id", sessionId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // The matcher configuration is still correct for restricting the middleware
  // only to admin paths, but the check in the middleware is also necessary
  // for robustness, especially if you move the config later.
  matcher: [
    "/api/admin/:path*",
    "/admin/:path*", // protect admin dashboard pages
  ],
};
