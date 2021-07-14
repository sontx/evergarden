import { HttpService, Injectable } from "@nestjs/common";
import { AuthUser } from "@evergarden/shared";

@Injectable()
export class FacebookAuthService {
  constructor(private httpService: HttpService) {}

  async getUserFromToken(token: string): Promise<Partial<AuthUser> | null> {
    const response = await this.httpService
      .get(`https://graph.facebook.com/v10.0/me?fields=id%2Cname%2Cemail%2Cpicture&access_token=${token}`)
      .toPromise();
    if (response.status === 200) {
      const data = response.data;
      return {
        fullName: data.name,
        email: data.email,
        photoUrl: data?.picture?.data?.url,
      };
    }
    return null;
  }
}
