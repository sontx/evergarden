import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(configService: ConfigService) {
    super({
      clientID: configService.get("credentials.google.clientId"),
      clientSecret: configService.get("credentials.google.secret"),
      callbackURL: "/api/auth/google/redirect",
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    this.logger.debug(`Validating google user id: ${profile.id}`);
    const { name, emails, photos, id, displayName } = profile;

    const user = {
      id,
      fullName: displayName,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
