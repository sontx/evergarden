import { Controller, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { StorageService } from "./storage.service";
import { BufferedFile } from "./file.model";

@Controller("storage")
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post("stories/:id")
  @UseInterceptors(FileInterceptor("file"))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async uploadFile(@UploadedFile() file: BufferedFile, @Param("id", ParseIntPipe) storyId: number) {
    return await this.storageService.upload(file, `${storyId}`);
  }
}
