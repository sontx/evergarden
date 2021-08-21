import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "./file.model";
import * as sharp from "sharp";
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

    const sharpObj = sharp(file.buffer);
    try {
      const previewFolder = `${storyId}/preview`;
      return await this.removeOldFilesAfterAction(previewFolder, async () => {
        const coverName = `${previewFolder}/${this.randomImageFileName()}`;
        const maxCoverWidth = this.configService.get<number>("settings.sizing.cover.maxWidth");
        const coverSharp = await this.resizeImage(sharpObj, maxCoverWidth);
        await this.saveImage(coverName, coverSharp);

        const thumbnailName = `${previewFolder}/${this.randomImageFileName()}`;
        const thumbnailWidth = this.configService.get<number>("settings.sizing.thumbnail.width");
        const thumbnailHeight = this.configService.get<number>("settings.sizing.thumbnail.height");
        const thumbnailSharp = await this.resizeImage(sharpObj, thumbnailWidth, thumbnailHeight);
        await this.saveImage(thumbnailName, thumbnailSharp);

        return {
          cover: this.buildUrl(`${this.bucket}/${coverName}`),
          thumbnail: this.buildUrl(`${this.bucket}/${thumbnailName}`),
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
    await this.initializeIfNeeded();
    await this.removeFolder(`${storyId}`);
  }
}
