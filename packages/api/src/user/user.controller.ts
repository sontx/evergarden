import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { GetUserDto, mergeObjects, UpdateUserSettingsDto } from "@evergarden/shared";
import { UserService } from "./user.service";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { Role } from "../auth/role/roles.decorator";
import { JwtConfig } from "../auth/jwt/jwt-config.decorator";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":id")
  @UseGuards(JwtGuard)
  @JwtConfig({ anonymous: true })
  async getUser(@Param("id") id: number, @Req() req): Promise<GetUserDto> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException();
    }
    const { id: userId } = req.user || {};
    if (user.role === "admin" && userId !== id) {
      throw new ForbiddenException();
    }
    return this.userService.toDto(user);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  @Put("settings")
  async updateUserSettings(@Req() req, @Body() settings: UpdateUserSettingsDto) {
    const { id } = req.user || {};
    const user = await this.userService.getById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    user.settings = mergeObjects(settings, user.settings || {});
    await this.userService.updateUser(user);
  }
}
