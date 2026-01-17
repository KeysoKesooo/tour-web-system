import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/core/services/UserService";
import { UpdateUserDTO } from "@/core/dto/user.dto";
import { requireAdmin } from "@/lib/requireAdmin";

const userService = new UserService();

// 1. GET User by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Updated to Promise
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params; // Await the id
    const user = await userService.getUserById(id);
    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 404 });
  }
}

// 2. UPDATE User
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Updated to Promise
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params; // Await the id
    const body = await req.json();
    const validated = UpdateUserDTO.parse(body);
    const updatedUser = await userService.updateProfile(id, validated);

    return NextResponse.json({ user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// 3. DELETE User
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // Updated to Promise
) {
  const auth = await requireAdmin(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params; // Await the id
    await userService.deleteUser(id);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
