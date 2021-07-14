import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";
import { ConfigService } from "@nestjs/config";
import { AuthUser } from "@evergarden/shared";

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client;

  constructor(private configService: ConfigService) {
    this.client = new OAuth2Client({
      clientId: configService.get("credentials.google.clientId"),
    });
  }

  async getUserFromToken(token: string): Promise<Partial<AuthUser> | null> {
    const ticket = await this.client.verifyIdToken({
      idToken: token,
    });
    const { name, email, picture } = ticket.getPayload();
    return {
      fullName: name,
      email,
      photoUrl: picture,
    };
  }
}
