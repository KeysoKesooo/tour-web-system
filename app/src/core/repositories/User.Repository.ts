import { prisma } from "../../lib/prisma";
import { User } from "@prisma/client";
import { CreateUserInput, UpdateUserInput } from "../dto/user.dto";

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  // Create user - if no role provided, uses database default
  async create(data: CreateUserInput | Omit<CreateUserInput, "role">): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}