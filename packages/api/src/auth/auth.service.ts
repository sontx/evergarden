import { AuthUser, JwtPayload } from "@evergarden/common";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "./../user/user.service";
import ms = require("ms");
import { User } from "src/user/user.entity";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private userService: UserService, private jwtService: JwtService, private configService: ConfigService) {}

  async googleLogin(req: any): Promise<User> {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const { email, fullName } = req.user || {};
    this.logger.debug(`Lookup ${email} in database...`);
    let found = await this.userService.getByEmail(email);
    this.logger.debug(`${found ? "Found" : "Not found"} ${email} in database!`);
    if (!found) {
      this.logger.debug(`Creating a new user for ${email}`);
      found = await this.userService.addUser({
        email,
        fullName,
        role: "user",
        provider: "google",
      });
      this.logger.debug(`Created a new user for ${email} with id ${found.id}`);
    }
    return found;
  }

  getAuthenticatedUser(user): AuthUser {
    return user && {id: user.id, email: user.email, fullName: user.fullName};
  }

  getCookieWithJwtAccessToken(user: User): string {
    const payload: JwtPayload = { email: user.email, id: user.id, role: user.role || "guest" };
    const expires = `${this.configService.get("jwt.auth.expires")}`;
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("jwt.auth.secret"),
      expiresIn: expires
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${ms(expires) / 1000}`;
  }

  getCookieWithJwtRefreshToken(user: User): { cookie: string; token: string } {
    const payload: Partial<JwtPayload> = { id: user.id };
    const expires = `${this.configService.get("jwt.refresh.expires")}`;
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("jwt.refresh.secret"),
      expiresIn: expires
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${ms(expires) / 1000}`;
    return {
      cookie,
      token,
    };
  }

  getCookiesForLogOut(): string[] {
    return ["Authentication=; HttpOnly; Path=/; Max-Age=0", "Refresh=; HttpOnly; Path=/; Max-Age=0"];
  }
}
