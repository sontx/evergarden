import { HttpModule, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import JwtRefreshGuard from "./jwt-refresh/jwt-refresh.guard";
import { JwtRefreshStrategy } from "./jwt-refresh/jwt-refresh.strategy";
import JwtGuard from "./jwt/jwt.guard";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { GoogleAuthService } from "./google-auth.service";
import { FacebookAuthService } from "./facebook-auth.service";

@Module({
  imports: [PassportModule, UserModule, JwtModule.register({}), HttpModule],
  providers: [
    AuthService,
    GoogleAuthService,
    FacebookAuthService,
    JwtStrategy,
    JwtGuard,
    JwtRefreshStrategy,
    JwtRefreshGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
