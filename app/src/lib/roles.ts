import { Role } from "@/types/RoleAction";

export class RoleManager {
  constructor(private role: Role) {}

  isAdmin() {
    return this.role === "admin";
  }

  isStaff() {
    return this.role === "staff";
  }

  isUser() {
    return this.role === "user";
  }

  canEditUsers() {
    return this.isAdmin();
  }

  canViewStaffPages() {
    return this.isAdmin() || this.isStaff();
  }

  canViewUserPages() {
    return true;
  }
}