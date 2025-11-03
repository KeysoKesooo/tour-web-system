import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  hasRole,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/authUtils";
import { UserService } from "@/core/services/UserService";
import { CreateUserDTO } from "@/dto/user.dto";

const userService = new UserService();

// GET /api/users - Admin only
export async function GET(req: NextRequest) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return unauthorizedResponse();

  if (!hasRole(auth.user, ["admin"])) {
    return forbiddenResponse("Admins only");
  }

  try {
    const users = await userService.getAllUsers();
    return Response.json({ users });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/users - Admin only (Admin can create users with specific roles)
export async function POST(req: NextRequest) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return unauthorizedResponse();

  if (!hasRole(auth.user, ["admin"])) {
    return forbiddenResponse("Admins only");
  }

  try {
    const body = await req.json();
    const validated = CreateUserDTO.parse(body);
    const newUser = await userService.createUser(validated);
    return Response.json({ user: newUser }, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}