import { SetMetadata } from "@nestjs/common";
import {Role as RoleType} from "@evergarden/common";

export const Role = (role: RoleType) => SetMetadata("role", role);
