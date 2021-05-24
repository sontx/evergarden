import { SetMetadata } from "@nestjs/common";
import {Role as RoleType} from "@evergarden/shared";

export interface JwtConfig {
  anonymous: boolean;
}

export const JwtConfig = (config: JwtConfig) => SetMetadata("jwt-config", config);
