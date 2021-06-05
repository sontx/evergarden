import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { ThumbnailUploadResponse } from "@evergarden/shared";
import { StorageService } from "./storage.service";

@Controller("storage")
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post("/thumbnail")
  @UseInterceptors(FileInterceptor("file"))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ThumbnailUploadResponse> {
    return { tempFileName: file.filename };
  }
}
