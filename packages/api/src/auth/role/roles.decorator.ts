import { SetMetadata } from "@nestjs/common";
import { Role as RoleType } from "../role/roles";

export const Role = (role: RoleType) => SetMetadata("role", role);
