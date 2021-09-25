import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sharp from "sharp";
import { IStorageManager } from "./interfaces/storage-manager";
import { StoryUploadResult } from "./interfaces/story-storage.service";
import { BufferedFile } from "./file.model";

export class StoryStorageHelper {
  constructor(private readonly configService: ConfigService, private readonly storageManager: IStorageManager) {}

  async upload(file: BufferedFile, storyId: number): Promise<StoryUploadResult> {
    await this.storageManager.initializeIfNeeded();
    this.storageManager.validateFileImage(file);

    const sharpObj = sharp(file.buffer);
    try {
      const imageDir = `${storyId}`;
      return await this.storageManager.uploadAndReplace(imageDir, async () => {
        const coverName = `${imageDir}/${this.storageManager.randomImageFileName()}`;
        const maxCoverWidth = this.configService.get<number>("settings.sizing.cover.maxWidth");
        const coverSharp = await this.storageManager.resizeImage(sharpObj, maxCoverWidth);
        await this.storageManager.saveImage(coverName, coverSharp);

        const thumbnailName = `${imageDir}/${this.storageManager.randomImageFileName()}`;
        const thumbnailWidth = this.configService.get<number>("settings.sizing.thumbnail.width");
        const thumbnailHeight = this.configService.get<number>("settings.sizing.thumbnail.height");
        const thumbnailSharp = await this.storageManager.resizeImage(sharpObj, thumbnailWidth, thumbnailHeight);
        await this.storageManager.saveImage(thumbnailName, thumbnailSharp);

        return {
          cover: this.storageManager.buildUrl(coverName),
          thumbnail: this.storageManager.buildUrl(thumbnailName),
        };
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException("Error uploading file");
    } finally {
      sharpObj?.destroy();
    }
  }

  async remove(storyId: number) {
    await this.storageManager.initializeIfNeeded();
    await this.storageManager.removeFolder(`${storyId}`);
  }
}
