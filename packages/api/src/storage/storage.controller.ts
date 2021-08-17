import { Controller, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { StorageService } from "./storage.service";
import { BufferedFile } from "./file.model";
import { ConfigService } from "@nestjs/config";

@Controller("storage")
export class StorageController {
  constructor(private storageService: StorageService, private configService: ConfigService) {}

  @Post("stories/:id")
  @UseInterceptors(FileInterceptor("file"))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async uploadFile(@UploadedFile() file: BufferedFile, @Param("id", ParseIntPipe) storyId: number) {
    const response = await this.storageService.upload(file, storyId);
    const host = this.configService.get("storage.host");
    return {
      thumbnail: `${host}/${response.thumbnail}`,
      cover: `${host}/${response.cover}`,
    }
  }
}
