import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/core/services/UserService";
import { CreateUserDTO } from "@/core/dto/user.dto";
import { requireAdmin } from "@/lib/requireAdmin";

const userService = new UserService();

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth) return auth; // returns the error response

  try {
    const users = await userService.getAllUsers();
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth) return auth;

  try {
    const body = await req.json();
    const validated = CreateUserDTO.parse(body);
    const newUser = await userService.createUser(validated);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
