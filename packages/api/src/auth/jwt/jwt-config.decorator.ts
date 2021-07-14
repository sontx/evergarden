import { SetMetadata } from "@nestjs/common";

export interface JwtConfig {
  anonymous: boolean;
}

export const JwtConfig = (config: JwtConfig) => SetMetadata("jwt-config", config);
