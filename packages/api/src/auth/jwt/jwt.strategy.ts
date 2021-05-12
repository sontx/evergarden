import {Injectable, UnauthorizedException} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {PassportStrategy} from "@nestjs/passport";
import {Request} from "express";
import {ExtractJwt, Strategy, VerifyCallback} from "passport-jwt";
import {UserService} from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = request?.cookies?.Authentication;
          if (!token) {
            token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwt.auth.secret"),
    });
  }

  async validate(payload, done: VerifyCallback) {
    try {
      const {iat, exp, ...user} = payload;
      done(null, user as any);
    } catch (err) {
      throw new UnauthorizedException("unauthorized", err.message);
    }
  }
}
