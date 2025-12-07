import bcrypt from "bcrypt";
import { UserRepository } from "@/core/repositories/User.Repository";
import { CreateUserInput, UpdateUserInput } from "@/core/dto/user.dto";
import { UserModel } from "@/core/models/User.model";
import { CacheService } from "@/lib/redis/cacheService";
import { enqueueJob } from "@/lib/redis/upstash";

export class UserService {
  private repo = new UserRepository();

  // ------------------- GET ALL USERS (TTL Cache) -------------------
  async getAllUsers(): Promise<UserModel[]> {
    return CacheService.getOrSet("users:all", 60, async () => {
      const users = await this.repo.findAll();
      if (!users || users.length === 0) throw new Error("No users found");
      return users.map((u) => new UserModel(u));
    });
  }

  // ------------------- GET SINGLE USER (TTL Cache) -------------------
  async getUserById(id: string): Promise<UserModel> {
    return CacheService.getOrSet(`user:${id}`, 60, async () => {
      const user = await this.repo.findById(id);
      if (!user) throw new Error("User not found");
      return new UserModel(user);
    });
  }

  // ------------------- CREATE USER (Write-Behind via QStash) -------------------
  async createUser(data: CreateUserInput): Promise<UserModel> {
    // Hash password first
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const payload = { ...data, password: hashedPassword };

    // Enqueue async job
    await enqueueJob("user-worker", { type: "createUser", payload });

    // Optionally return a temporary UserModel (with pending ID or placeholder)
    return new UserModel({ ...payload, id: "pending" } as any);
  }

  // ------------------- UPDATE USER (Invalidate Cache) -------------------
  async updateProfile(
    userId: string,
    data: UpdateUserInput
  ): Promise<UserModel> {
    const updated = await this.repo.update(userId, data);

    await CacheService.invalidate(`user:${userId}`);
    await CacheService.invalidate("users:all");

    return new UserModel(updated);
  }

  // ------------------- CHANGE PASSWORD (Invalidate Cache) -------------------
  async changePassword(userId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.repo.update(userId, { password: hashed });

    await CacheService.invalidate(`user:${userId}`);
    await CacheService.invalidate("users:all");

    return { message: "Password updated successfully" };
  }

  // ------------------- DELETE USER (Write-Behind via QStash) -------------------
  async deleteUser(userId: string) {
    // Enqueue async deletion
    await enqueueJob("user-worker", {
      type: "deleteUser",
      payload: { id: userId },
    });

    return { message: "User deletion scheduled" };
  }
}
