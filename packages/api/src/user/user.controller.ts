import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { GetUserDto, mergeObjects, UpdateUserSettingsDto } from "@evergarden/shared";
import { UserService } from "./user.service";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { Role } from "../auth/role/roles.decorator";
import { JwtConfig } from "../auth/jwt/jwt-config.decorator";
import { UserStorageService } from "../storage/user-storage.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "../storage/file.model";
import { UpdateUserDto } from "@evergarden/shared";

@Controller("users")
export class UserController {
  constructor(private userService: UserService, private userStorageService: UserStorageService) {}

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
    return {
      id: id,
      fullName: user.fullName,
    };
  }

  @Put()
  @UseGuards(JwtGuard)
  @Role("user")
  async updateUser(@Req() req, @Body() updateUserData: UpdateUserDto): Promise<GetUserDto> {
    const { id } = req.user || {};
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException();
    }
    user.fullName = updateUserData.fullName;
    await this.userService.updateUser(user);
    return this.userService.toDto(user);
  }

  @Put("settings")
  @UseGuards(JwtGuard, RolesGuard)
  @Role("user")
  async updateSettings(@Req() req, @Body() settings: UpdateUserSettingsDto) {
    const { id } = req.user || {};
    const user = await this.userService.getById(id);
    if (!user) {
      throw new UnauthorizedException();
    }

    user.settings = mergeObjects(settings, user.settings || {});
    await this.userService.updateUser(user);
  }

  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async uploadAvatar(@UploadedFile() file: BufferedFile, @Req() req): Promise<GetUserDto> {
    const { id } = req.user || {};
    const user = await this.userService.getById(id);
    if (!user) {
      throw new NotFoundException();
    }

    user.photoUrl = await this.userStorageService.upload(file, id);
    await this.userService.updateUser(user);
    return this.userService.toDto(user);
  }
}
