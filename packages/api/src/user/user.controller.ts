import {
  Body,
  Controller,
  Get,
  Logger,
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

@Controller("users")
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get(":id")
  async getUser(@Param("id") id: number): Promise<GetUserDto> {
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException();
    }
    return this.userService.toDto(user);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  @Put("current/settings")
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
