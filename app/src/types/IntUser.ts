import { Role } from "./RoleAction";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}
