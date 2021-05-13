import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res, UnauthorizedException,
  UseGuards
} from "@nestjs/common";
import { Response } from "express";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import GoogleGuard from "./google/google.guard";
import JwtRefreshGuard from "./jwt-refresh/jwt-refresh.guard";
import JwtGuard from "./jwt/jwt.guard";
import {ExtractJwt} from "passport-jwt";

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
    const accessToken = this.authService.getAccessToken(user);
    let responseHTML = `<html><head><title>Logged in</title></head><body></body><script>res = %value%; window.opener.postMessage(res, "*");</script></html>`;
    responseHTML = responseHTML.replace(
      "%value%",
      JSON.stringify({
        user: this.authService.getAuthenticatedUser(user),
        token: accessToken,
      }),
    );
    res.status(200).send(responseHTML);
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

    const accessToken = this.authService.getAccessToken(user);
    const accessTokenCookie = this.authService.getAccessTokenCookie(accessToken);
    res.setHeader("Set-Cookie", accessTokenCookie);
    res.send(this.authService.getAuthenticatedUser(req.user))
  }

  @Get()
  @UseGuards(JwtGuard)
  async authenticate(@Req() req, @Res() res: Response) {
    const id = req.user.id;
    const hasAuthCookie = !!req.headers["Authentication"];
    if (!id || hasAuthCookie) {
      throw new UnauthorizedException();
    }

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const accessTokenCookie = this.authService.getAccessTokenCookie(token);
    const {cookie: refreshTokenCookie, token: refreshToken} = this.authService.getCookieWithJwtRefreshToken(id);

    await this.userService.setCurrentRefreshToken(refreshToken, id);

    res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);

    const user = await this.userService.getById(id);
    res.send(this.authService.getAuthenticatedUser(user));
  }

  @Post("logout")
  @UseGuards(JwtGuard)
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    await this.userService.removeRefreshToken(req.user.id);
    res.setHeader("Set-Cookie", this.authService.getCookiesForLogOut());
  }
}
