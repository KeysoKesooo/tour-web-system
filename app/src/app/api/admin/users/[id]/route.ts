import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/core/services/UserService";
import { UpdateUserDTO } from "@/core/dto/user.dto";
import { requireAdmin } from "@/lib/requireAdmin";

const userService = new UserService();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if (!auth) return auth;

  try {
    const user = await userService.getUserById(params.id);
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if (!auth) return auth;

  try {
    const body = await req.json();
    const validated = UpdateUserDTO.parse(body);
    const updatedUser = await userService.updateProfile(params.id, validated);

    return NextResponse.json({ user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if (!auth) return auth;

  try {
    await userService.deleteUser(params.id);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
