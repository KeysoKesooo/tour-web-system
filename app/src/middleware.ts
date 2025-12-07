// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimiter } from "@/lib/redis/rateLimiter";

export async function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Allow auth and public paths
  if (path.startsWith("/api/auth") || path.startsWith("/api/public/")) {
    return NextResponse.next();
  }

  // Extract session ID from cookie (or Authorization)
  const cookieHeader = req.headers.get("cookie");
  const session =
    cookieHeader?.match(/auth_session=([^;]+)/)?.[1] ||
    (req.headers.get("authorization")?.startsWith("Bearer ")
      ? req.headers.get("authorization")!.substring(7)
      : null);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit by session id
  const { success } = await rateLimiter.limit(session);

  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // forward session id header
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-session-id", session);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*"],
};
