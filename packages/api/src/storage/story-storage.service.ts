import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "./file.model";
import imageSize from "image-size";
import * as sharp from "sharp";
import { Sharp } from "sharp";
import { StorageService } from "./storage.service";

const THUMBNAIL_BUCKET = "thumbnails";
const COVER_BUCKET = "covers";

@Injectable()
export class StoryStorageService extends StorageService {
  constructor(configService: ConfigService) {
    super(configService);
  }

  protected async onInitialize(): Promise<void> {
    await this.createBucketIfNeeded(THUMBNAIL_BUCKET, true);
    await this.createBucketIfNeeded(COVER_BUCKET, true);
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

      const fileName = this.makeFileName(storyId);
      coverSharp = await this.saveCover(originSharp, fileName);
      thumbnailSharp = await this.saveThumbnail(originSharp, fileName);

      return {
        cover: `${COVER_BUCKET}/${fileName}`,
        thumbnail: `${THUMBNAIL_BUCKET}/${fileName}`,
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

  private makeFileName(storyId: number): string {
    return `${storyId}.jpg`;
  }

  private async saveCover(originSharp: Sharp, fileName: string) {
    const maxCoverWidth = this.configService.get<number>("settings.sizing.cover.maxWidth");
    const coverSharp = await this.resizeImage(originSharp, maxCoverWidth);
    await this.saveImage(COVER_BUCKET, fileName, coverSharp);
    return coverSharp;
  }

  private async saveThumbnail(originSharp: Sharp, fileName: string) {
    const thumbnailWidth = this.configService.get<number>("settings.sizing.thumbnail.width");
    const thumbnailHeight = this.configService.get<number>("settings.sizing.thumbnail.height");
    const thumbnailSharp = await this.resizeImage(originSharp, thumbnailWidth, thumbnailHeight);
    await this.saveImage(THUMBNAIL_BUCKET, fileName, thumbnailSharp);
    return thumbnailSharp;
  }

  async remove(storyId: number) {
    await this.initializeIfNeeded();

    const fileName = this.makeFileName(storyId);
    await this.client.removeObject(THUMBNAIL_BUCKET, fileName);
    await this.client.removeObject(COVER_BUCKET, fileName);
  }
}
