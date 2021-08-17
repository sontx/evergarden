import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "./auth.service";
import JwtRefreshGuard from "./jwt-refresh/jwt-refresh.guard";
import JwtGuard from "./jwt/jwt.guard";
import { Auth2Body, UserPass } from "@evergarden/shared";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService, private userService: UserService) {}

  @Post()
  async login(@Body() auth: Auth2Body | UserPass, @Res() res: Response) {
    const user = this.isUserPass(auth) ? await this.authService.login(auth) : await this.loginWithAuth2(auth);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { cookie: refreshTokenCookie, token: refreshToken } = this.authService.getCookieWithJwtRefreshToken(user.id);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    const accessTokenCookie = this.authService.getAccessTokenCookie(user);

    res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    res.send(this.authService.getAuthenticatedUser(user));
  }

  private async loginWithAuth2(auth: Auth2Body): Promise<User> {
    const token = auth.token;
    switch (auth.provider) {
      case "google":
        return await this.authService.loginGoogle(token);
      case "facebook":
        return await this.authService.loginFacebook(token);
    }
    return null;
  }

  private isUserPass(auth: Auth2Body | UserPass): auth is UserPass {
    return "username" in auth && "password" in auth;
  }

  @Get("refresh")
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() req, @Res() res: Response) {
    const id = req.user.id;
    if (!id) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    const accessTokenCookie = this.authService.getAccessTokenCookie(user);
    res.setHeader("Set-Cookie", accessTokenCookie);
    res.send(this.authService.getAuthenticatedUser(user));
  }

  @Get()
  @UseGuards(JwtGuard)
  async getAuthenticatedUser(@Req() req) {
    const id = req.user.id;
    if (!id) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getById(id);
    return this.authService.getAuthenticatedUser(user);
  }

  @Post("logout")
  @UseGuards(JwtGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.userService.removeRefreshToken(req.user.id);
    res.setHeader("Set-Cookie", this.authService.getCookiesForLogOut());
  }
}
