import { NextRequest } from "next/server";
import {
  getAuthenticatedUser,
  hasRole,
  unauthorizedResponse,
  forbiddenResponse,
} from "@/lib/authUtils";
import { UserService } from "@/core/services/UserService";
import { UpdateUserDTO } from "@/dto/user.dto";

const userService = new UserService();

// GET /api/users/[id] - Admin only
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return unauthorizedResponse();

  if (!hasRole(auth.user, ["admin"])) {
    return forbiddenResponse("Admins only");
  }

  try {
    const user = await userService.getUserById(params.id);
    return Response.json({ user });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 404 });
  }
}

// PUT /api/users/[id] - Admin only
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return unauthorizedResponse();

  if (!hasRole(auth.user, ["admin"])) {
    return forbiddenResponse("Admins only");
  }

  try {
    const body = await req.json();
    const validated = UpdateUserDTO.parse(body);
    const updatedUser = await userService.updateProfile(params.id, validated);
    return Response.json({ user: updatedUser });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/users/[id] - Admin only
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await getAuthenticatedUser(req);
  if (!auth) return unauthorizedResponse();

  if (!hasRole(auth.user, ["admin"])) {
    return forbiddenResponse("Admins only");
  }

  try {
    await userService.deleteUser(params.id);
    return Response.json({ message: "User deleted successfully" });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}