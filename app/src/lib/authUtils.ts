import { NextRequest } from "next/server";
import { validateSession } from "./auth";
import { User } from "@prisma/client";

export async function getAuthenticatedUser(
  req: NextRequest,
): Promise<{ user: User; sessionId: string } | null> {
  // 1. Prioritize Proxy-injected header, then fall back to direct cookie reading
  let sessionId =
    req.headers.get("x-session-id") || req.cookies.get("auth_session")?.value;

  if (!sessionId) return null;

  try {
    // 2. Decode the ID (Next.js 16 sometimes encodes cookie values)
    const decodedId = decodeURIComponent(sessionId);

    const { user, session } = await validateSession(decodedId);
    if (!user || !session) return null;

    return { user: user as User, sessionId: session.id };
  } catch (error) {
    console.error("Auth validation failed:", error);
    return null;
  }
}

export const hasRole = (user: User, allowedRoles: string[]) =>
  allowedRoles.includes(user.role);
export const unauthorizedResponse = () =>
  Response.json({ error: "Invalid token" }, { status: 401 });
export const forbiddenResponse = (msg = "Access denied") =>
  Response.json({ error: msg }, { status: 403 });
