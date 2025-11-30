import bcrypt from "bcrypt";
import { auth } from "@/lib/auth";
import { UserRepository } from "@/core/repositories/User.Repository";

export class AuthService {
  private userRepo = new UserRepository();

  // Login user
  async login(email: string, password: string) {
    // Find user by email
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Invalid email or password");
    }

    // Create session
    const session = await auth.createSession(user.id, {});
    const sessionCookie = auth.createSessionCookie(session.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      sessionCookie,
    };
  }

  // Logout user
  async logout(sessionId: string) {
    await auth.invalidateSession(sessionId);
    const sessionCookie = auth.createBlankSessionCookie();
    return { sessionCookie };
  }
}
