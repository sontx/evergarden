import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Role } from "../auth/role/roles.decorator";
import JwtGuard from "../auth/jwt/jwt.guard";
import { RolesGuard } from "../auth/role/roles.guard";
import { ThumbnailUploadResponse } from "@evergarden/shared";
import { UploadService } from "./upload.service";

@Controller("upload")
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post("/thumbnail")
  @UseInterceptors(FileInterceptor("file"))
  @Role("user")
  @UseGuards(JwtGuard, RolesGuard)
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<ThumbnailUploadResponse> {
    const result = await this.uploadService.saveThumbnail(file.filename);
    console.log(result);
    return { tempFileName: file.filename };
  }
}
