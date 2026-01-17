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
    // 1. Hash password first
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 2. Prepare the data for the database
    const dbPayload = {
      ...data,
      password: hashedPassword,
    };

    // 3. 🔑 THE FIX: Save to DB via Repository synchronously
    // This generates the actual ID and ensures the record exists
    const savedUser = await this.repo.create(dbPayload);

    console.log("✅ User persisted to DB with ID:", savedUser.id);

    // 4. Enqueue async job (for side effects like emails or logging)
    // We pass the savedUser so the worker has the real ID
    await enqueueJob("user-worker", {
      type: "createUser",
      payload: savedUser,
    });

    // 5. Return the real UserModel from the database
    return new UserModel(savedUser);
  }

  // ------------------- UPDATE USER (Invalidate Cache) -------------------
  async updateProfile(
    userId: string,
    data: UpdateUserInput,
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
    // 1. 🔑 THE FIX: Call the repository to actually remove from DB
    // This will trigger the 'prisma:query DELETE' in your terminal
    await this.repo.delete(userId);

    // 2. Enqueue the job for secondary cleanup tasks
    // (e.g., removing avatar from S3, cleaning up logs)
    await enqueueJob("user-worker", {
      type: "deleteUser",
      payload: { id: userId },
    });

    // 3. Return a real confirmation
    return { message: "User successfully deleted" };
  }
}
