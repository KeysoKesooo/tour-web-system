import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/core/services/UserService";
import { CreateUserDTO } from "@/core/dto/user.dto";
import { requireAdmin } from "@/lib/requireAdmin";

const userService = new UserService();

export async function POST(req: NextRequest) {
  // 1. Security Check
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    // 2. Extract body safely
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 },
      );
    }

    // 3. Validate with DTO
    const validated = CreateUserDTO.parse(body);

    // 4. Create User
    const newUser = await userService.createUser(validated);

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (err: any) {
    // 5. Handle Validation Errors (This is likely the cause of your 400)
    if (err.name === "ZodError") {
      console.error("Zod Validation Error:", err.errors);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: err.errors.map(
            (e: any) => `${e.path.join(".")}: ${e.message}`,
          ),
        },
        { status: 400 },
      );
    }

    console.error("User Creation Error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    const users = await userService.getAllUsers();
    return NextResponse.json({ users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
