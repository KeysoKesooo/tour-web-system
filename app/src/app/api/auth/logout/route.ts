import { NextRequest } from "next/server";
import { AuthService } from "@/core/services/AuthService";
import { getAuthenticatedUser, unauthorizedResponse } from "@/lib/authUtils";
import { cookies } from "next/headers";

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(req);
    if (!auth) return unauthorizedResponse();

    const { sessionCookie } = await authService.logout(auth.sessionId);

    // Clear cookie
    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return Response.json({ message: "Logged out successfully" });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Logout failed" },
      { status: 500 }
    );
  }
}