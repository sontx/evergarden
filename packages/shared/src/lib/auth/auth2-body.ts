import { IsJWT, IsString, Matches } from 'class-validator';

export type OAuth2Provider = 'google' | 'facebook';

export class Auth2Body {
  @IsJWT()
  token: string;

  @IsString()
  @Matches(/google|facebook/s)
  provider: OAuth2Provider;
}
