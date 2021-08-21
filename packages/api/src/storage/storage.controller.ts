import { Controller, Param, ParseIntPipe, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { BufferedFile } from "./file.model";
import { ConfigService } from "@nestjs/config";
import { StoryStorageService } from "./story-storage.service";

@Controller("storage")
export class StorageController {
  constructor(private storyStorageService: StoryStorageService, private configService: ConfigService) {}

  @Post("stories/:id")
  @UseInterceptors(FileInterceptor("file"))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async updateStoryCover(@UploadedFile() file: BufferedFile, @Param("id", ParseIntPipe) storyId: number) {
    const response = await this.storyStorageService.upload(file, storyId);
    const host = this.configService.get("storage.host");
    return {
      thumbnail: `${host}/${response.thumbnail}`,
      cover: `${host}/${response.cover}`,
    };
  }

  @Post("users")
  @UseInterceptors(FileInterceptor("file"))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async uploadUserAvatar(@UploadedFile() file: BufferedFile, @Req() req) {
    const { id } = req.user || {};

    const host = this.configService.get("storage.host");
  }
}
