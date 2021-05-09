import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "./../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import GoogleGuard from "./google/google.guard";
import { GoogleStrategy } from "./google/google.strategy";
import JwtRefreshGuard from "./jwt-refresh/jwt-refresh.guard";
import { JwtRefreshStrategy } from "./jwt-refresh/jwt-refresh.strategy";
import JwtGuard from "./jwt/jwt.guard";
import { JwtStrategy } from "./jwt/jwt.strategy";

@Module({
  imports: [PassportModule, UserModule, JwtModule.register({})],
  providers: [
    AuthService,
    GoogleStrategy,
    GoogleGuard,
    JwtStrategy,
    JwtGuard,
    JwtRefreshStrategy,
    JwtRefreshGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
