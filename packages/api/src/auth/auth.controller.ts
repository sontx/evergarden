import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { Response } from "express";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import JwtRefreshGuard from "./jwt-refresh/jwt-refresh.guard";
import JwtGuard from "./jwt/jwt.guard";
import { Auth2Body } from "@evergarden/shared";

@Controller("auth")
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService, private userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async loginOAuth2(@Body() auth: Auth2Body, @Res() res: Response) {
    const token = auth.token;
    let user;
    switch (auth.provider) {
      case "google":
        user = await this.authService.loginGoogle(token);
        break;
      case "facebook":
        user = await this.authService.loginFacebook(token);
        break;
    }
    if (user) {
      const { cookie: refreshTokenCookie, token: refreshToken } = this.authService.getCookieWithJwtRefreshToken(
        user.id,
      );
      await this.userService.setCurrentRefreshToken(refreshToken, user.id);
      const accessTokenCookie = this.authService.getAccessTokenCookie(user);

      res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);
    } else {
      throw new UnauthorizedException();
    }
    res.send(this.authService.getAuthenticatedUser(user));
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
    res.send(this.authService.getAuthenticatedUser(req.user));
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
