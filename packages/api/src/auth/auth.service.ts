import {AuthUser, IdType, JwtPayload, OAuth2Provider} from "@evergarden/shared";
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { User } from "src/user/user.entity";
import { GoogleAuthService } from "./google/google-auth.service";
import ms = require("ms");
import {FacebookAuthService} from "./facebook/facebook-auth.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private googleAuthService: GoogleAuthService,
    private facebookAuthService: FacebookAuthService,
  ) {}

  async loginFacebook(token: string): Promise<User | null> {
    const authUser = await this.facebookAuthService.getUserFromToken(token);
    return this.doLogin(authUser, "facebook");
  }

  async loginGoogle(token: string): Promise<User | null> {
    const authUser = await this.googleAuthService.getUserFromToken(token);
    return this.doLogin(authUser, "google");
  }

  private async doLogin(authUser: Partial<AuthUser>, provider: OAuth2Provider): Promise<User> {
    if (!authUser) {
      return null;
    }

    const { email, fullName, photoUrl } = authUser;
    this.logger.debug(`Lookup ${email} in database...`);
    let found = await this.userService.getByEmail(email);
    this.logger.debug(`${found ? "Found" : "Not found"} ${email} in database!`);
    if (!found) {
      this.logger.debug(`Creating a new user for ${email}`);
      found = await this.userService.addUser({
        email,
        fullName,
        role: "user",
        provider,
        photoUrl: photoUrl,
      });
      this.logger.debug(`Created a new user for ${email} with id ${found.id}`);
    }
    return found;
  }

  getAuthenticatedUser(user: User): AuthUser {
    return (
      user && {
        id: user.id.toHexString(),
        email: user.email,
        fullName: user.fullName,
        photoUrl: user.photoUrl,
        settings: user.settings,
        historyId: user.historyId,
      }
    );
  }

  private getAccessToken(user: User): string {
    const payload: JwtPayload = {
      email: user.email,
      id: user.id.toHexString(),
      role: user.role || "guest",
      historyId: user.historyId,
    };
    const expires = `${this.configService.get("jwt.auth.expires")}`;
    return this.jwtService.sign(payload, {
      secret: this.configService.get("jwt.auth.secret"),
      expiresIn: expires,
    });
  }

  getAccessTokenCookie(user: User): string {
    const token = this.getAccessToken(user);
    const expires = `${this.configService.get("jwt.auth.expires")}`;
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${ms(expires) / 1000}`;
  }

  getCookieWithJwtRefreshToken(userId: IdType): { cookie: string; token: string } {
    const payload: Partial<JwtPayload> = { id: userId };
    const expires = `${this.configService.get("jwt.refresh.expires")}`;
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get("jwt.refresh.secret"),
      expiresIn: expires,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${ms(expires) / 1000}`;
    return {
      cookie,
      token,
    };
  }

  getCookiesForLogOut(): string[] {
    return [
      "Authentication=; HttpOnly; Path=/; Max-Age=0",
      "Refresh=; HttpOnly; Path=/; Max-Age=0",
    ];
  }
}
