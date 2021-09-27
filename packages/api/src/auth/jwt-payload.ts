import { Role } from "./role/roles";

export interface JwtPayload {
  id: number;
  email: string;
  role: Role;
}
