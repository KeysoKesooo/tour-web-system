import { NextRequest } from "next/server";
import { validateSession } from "./auth";
import { User } from "@prisma/client";

/**
 * Extract and validate session from API route
 * Use this in your API route handlers instead of middleware
 */
export async function getAuthenticatedUser(
  req: NextRequest,
): Promise<{ user: User; sessionId: string } | null> {
  // Get session ID from middleware-injected header or cookie
  let sessionId = req.headers.get("x-session-id");

  if (!sessionId) {
    const cookieHeader = req.headers.get("cookie");
    if (cookieHeader) {
      const match = cookieHeader.match(/auth_session=([^;]+)/);
      sessionId = match ? match[1] : null;
    }
  }

  if (!sessionId) return null;

  // Validate session using Lucia (this runs in Node.js runtime, not Edge)
  const { user, session } = await validateSession(sessionId);

  if (!user || !session) return null;

  return { user: user as User, sessionId: session.id };
}

/**
 * Check if user has required role
 */
export function hasRole(user: User, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role);
}

/**
 * Unauthorized response helper
 */
export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

/**
 * Forbidden response helper
 */
export function forbiddenResponse(message = "Access denied") {
  return Response.json({ error: `Forbidden: ${message}` }, { status: 403 });
}
