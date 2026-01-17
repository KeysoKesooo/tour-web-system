import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimiter } from "@/lib/redis/rateLimiter";

export async function proxy(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  // 1. Skip auth for public and auth-specific routes
  if (path.startsWith("/api/auth") || path.startsWith("/api/public/")) {
    return NextResponse.next();
  }

  // 2. Extract session safely using Next.js built-in cookie parser
  const session =
    req.cookies.get("auth_session")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized: No session found" },
      { status: 401 },
    );
  }

  // 3. Rate limit check
  const { success } = await rateLimiter.limit(session);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // 4. Inject session into headers for the API to read
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-session-id", session);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*"],
};
