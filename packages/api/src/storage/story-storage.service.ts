import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "./file.model";
import imageSize from "image-size";
import * as sharp from "sharp";
import { Sharp } from "sharp";
import { StorageService } from "./storage.service";

@Injectable()
export class StoryStorageService extends StorageService {
  constructor(configService: ConfigService) {
    super(configService, "stories");
  }

  async upload(
    file: BufferedFile,
    storyId: number,
  ): Promise<{
    thumbnail: string;
    cover: string;
  }> {
    await this.initializeIfNeeded();
    this.validateFileImage(file);

    const info = imageSize(file.buffer);
    let originSharp = sharp(file.buffer);
    let coverSharp: Sharp;
    let thumbnailSharp: Sharp;

    try {
      // Convert file to jpg if needed
      if (info.type === "png") {
        originSharp = originSharp.toFormat("jpg");
      }

      const coverName = `${storyId}/${this.randomImageFileName()}`;
      coverSharp = await this.saveCover(originSharp, coverName);
      const thumbnailName = `${storyId}/${this.randomImageFileName()}`;
      thumbnailSharp = await this.saveThumbnail(originSharp, thumbnailName);

      return {
        cover: this.buildUrl(`${this.bucket}/${coverName}`),
        thumbnail: this.buildUrl(`${this.bucket}/${thumbnailName}`),
      };
    } catch (e) {
      console.log(e);
      throw new BadRequestException("Error uploading file");
    } finally {
      originSharp?.destroy();
      coverSharp?.destroy();
      thumbnailSharp?.destroy();
    }
  }

  private async saveCover(originSharp: Sharp, fileName: string) {
    const maxCoverWidth = this.configService.get<number>("settings.sizing.cover.maxWidth");
    const coverSharp = await this.resizeImage(originSharp, maxCoverWidth);
    await this.saveImage(fileName, coverSharp);
    return coverSharp;
  }

  private async saveThumbnail(originSharp: Sharp, fileName: string) {
    const thumbnailWidth = this.configService.get<number>("settings.sizing.thumbnail.width");
    const thumbnailHeight = this.configService.get<number>("settings.sizing.thumbnail.height");
    const thumbnailSharp = await this.resizeImage(originSharp, thumbnailWidth, thumbnailHeight);
    await this.saveImage(fileName, thumbnailSharp);
    return thumbnailSharp;
  }

  async remove(storyId: number) {
    await this.initializeIfNeeded();
    await this.removeFolder(`${storyId}`);
  }
}
