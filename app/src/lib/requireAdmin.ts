// /lib/requireAdmin.ts
import { NextRequest, NextResponse } from "next/server";
import {
  getAuthenticatedUser,
  unauthorizedResponse,
  forbiddenResponse,
  hasRole,
} from "./authUtils";

export async function requireAdmin(req: NextRequest) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return unauthorizedResponse();

  if (!hasRole(auth.user, ["ADMIN"])) {
    return forbiddenResponse("Admins only");
  }

  return auth;
}
