import { Controller, Get, Logger, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Response } from "express";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import GoogleGuard from "./google/google.guard";
import JwtRefreshGuard from "./jwt-refresh/jwt-refresh.guard";
import JwtGuard from "./jwt/jwt.guard";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService, private userService: UserService) {}

  @Get("google")
  @UseGuards(GoogleGuard)
  async googleAuth() {
    this.logger.debug("Requesting a google authentication");
  }

  @Get("google/redirect")
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    this.logger.debug("Accept redirect request from google");
    const user = await this.authService.googleLogin(req);
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user);
    const { cookie: refreshTokenCookie, token: refreshToken } = this.authService.getCookieWithJwtRefreshToken(user);
    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    res.send(this.authService.getAuthenticatedUser(user));
  }

  @Get("refresh")
  @UseGuards(JwtRefreshGuard)
  refresh(@Req() req) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(req.user);
    req.res.setHeader("Set-Cookie", accessTokenCookie);
    return this.authService.getAuthenticatedUser(req.user);
  }

  @Get()
  @UseGuards(JwtGuard)
  authenticate(@Req() req) {
    return this.authService.getAuthenticatedUser(req.user);
  }

  @Post("logout")
  @UseGuards(JwtGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.userService.removeRefreshToken(req.user.id);
    res.setHeader("Set-Cookie", this.authService.getCookiesForLogOut());
  }
}
