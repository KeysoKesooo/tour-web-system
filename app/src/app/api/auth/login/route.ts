import { NextRequest } from "next/server";
import { AuthService } from "@/core/services/AuthService";
import { LoginDTO } from "@/core/dto/auth.dto";
import { cookies } from "next/headers";

const authService = new AuthService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = LoginDTO.parse(body);

    const { user, sessionCookie } = await authService.login(
      validated.email,
      validated.password
    );

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return Response.json({
      message: "Login successful",
      user,
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Login failed" },
      { status: 401 }
    );
  }
}