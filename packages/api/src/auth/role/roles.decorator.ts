import { SetMetadata } from "@nestjs/common";
import {Role as RoleType} from "@evergarden/shared";

export const Role = (role: RoleType) => SetMetadata("role", role);
