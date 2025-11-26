import { Role } from "@/types/RoleAction";

export class RoleManager {
  constructor(private role: Role) {}

  isAdmin() {
    return this.role === "ADMIN";
  }

  isStaff() {
    return this.role === "STAFF";
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
