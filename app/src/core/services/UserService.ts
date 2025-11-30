import bcrypt from "bcrypt";
import { UserRepository } from "@/core/repositories/User.Repository";
import { CreateUserInput, UpdateUserInput } from "../dto/user.dto";
import { UserModel } from "@/core/models/User.model";

export class UserService {
  private repo = new UserRepository();

  // Get all users
  async getAllUsers() {
    const users = await this.repo.findAll();
    if (!users || users.length === 0) {
      throw new Error("No users found");
    }
    return users.map((u) => new UserModel(u));
  }

  // Get single user by ID
  async getUserById(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new Error("User not found");
    return new UserModel(user);
  }

  // Create new user
  async createUser(data: CreateUserInput) {
    // Check duplicate email
    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new Error("Email already exists");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.repo.create({
      ...data,
      password: hashedPassword,
      role: data.role,
    });

    return new UserModel(newUser);
  }

  // Update profile
  async updateProfile(userId: string, data: UpdateUserInput) {
    const updated = await this.repo.update(userId, data);
    return new UserModel(updated);
  }

  // Change password
  async changePassword(userId: string, newPassword: string) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.repo.update(userId, { password: hashed });
    return { message: "Password updated successfully" };
  }

  // Delete user
  async deleteUser(userId: string) {
    await this.repo.delete(userId);
    return { message: "User deleted successfully" };
  }
}
