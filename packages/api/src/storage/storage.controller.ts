import { Controller, Param, ParseIntPipe, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { BufferedFile } from "./file.model";
import { StoryStorageService } from "./story-storage.service";
import { UserStorageService } from "./user-storage.service";

@Controller("storage")
export class StorageController {
  constructor(private storyStorageService: StoryStorageService, private userStorageService: UserStorageService) {}

  @Post("stories/:id")
  @UseInterceptors(FileInterceptor("file"))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async updateStoryCover(@UploadedFile() file: BufferedFile, @Param("id", ParseIntPipe) storyId: number) {
    return await this.storyStorageService.upload(file, storyId);
  }
}
