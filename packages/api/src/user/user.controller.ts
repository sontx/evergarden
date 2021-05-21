import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Put, Req, UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { GetUserDto, UpdateUserSettingsDto } from "@evergarden/shared";
import { UserService } from "./user.service";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { Role } from "../auth/role/roles.decorator";

@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get("ping/:id")
  async getUser(@Param("id") id: string): Promise<GetUserDto> {
    try {
      const user = await this.userService.getById(id);
      if (!user) {
        throw new NotFoundException();
      }
      return this.userService.toDto(user);
    } catch (e) {
      this.logger.warn(`Not found user id ${id}`, e);
      throw new NotFoundException();
    }
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  @Put("current/settings")
  async updateUserSettings(@Req() req, @Body() settings: UpdateUserSettingsDto) {
    const {id} = req.user || {};
    if (!id) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.getById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    try {
      const oldSettings = user.settings || ({} as any);
      user.settings = {
        readingFont: settings.readingFont || oldSettings.readingFont,
        readingFontSize: settings.readingFontSize || oldSettings.readingFontSize,
        readingLineSpacing: settings.readingLineSpacing || oldSettings.readingLineSpacing,
      };
      await this.userService.updateUser(user);
    } catch (e) {
      this.logger.warn(`Error while update settings for user ${id}`, e);
      throw new BadRequestException();
    }
  }
}
