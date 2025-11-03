import { User } from "@prisma/client";
import { RoleManager } from "@/lib/roles";
import { Role, IUser } from "@/types";

export class UserModel implements IUser {
  constructor(private user: User) {}

  get id(): string { return this.user.id; }
  get name(): string { return this.user.name; }
  get email(): string { return this.user.email; }
  get role(): Role { return this.user.role as Role; }

  displayName(): string {
    return `${this.user.name} (${this.user.role})`;
  }

  getRoleManager() {
    return new RoleManager(this.user.role as Role);
  }

  canEditUsers() {
    return this.getRoleManager().canEditUsers();
  }
}
