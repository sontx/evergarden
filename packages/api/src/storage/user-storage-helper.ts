import { BadRequestException } from "@nestjs/common";
import * as sharp from "sharp";
import { BufferedFile } from "./file.model";
import { IStorageManager } from "./interfaces/storage-manager";
import { ConfigService } from "@nestjs/config";

export class UserStorageHelper {
  constructor(private readonly configService: ConfigService, private readonly storageManager: IStorageManager) {}

  async upload(file: BufferedFile, userId: number): Promise<string> {
    await this.storageManager.initializeIfNeeded();
    this.storageManager.validateFileImage(file);

    const sharpObj = sharp(file.buffer);
    try {
      const imageDir = `${userId}`;
      return await this.storageManager.uploadAndReplace(imageDir, async () => {
        const width = this.configService.get<number>("settings.sizing.avatar.width");
        const height = this.configService.get<number>("settings.sizing.avatar.height");
        const resizedSharp = await this.storageManager.resizeImage(sharpObj, width, height);
        const fileName = `${imageDir}/${this.storageManager.randomImageFileName()}`;
        await this.storageManager.saveImage(fileName, resizedSharp);
        return this.storageManager.buildUrl(fileName);
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException("Error uploading file");
    } finally {
      sharpObj?.destroy();
    }
  }

  async removeAvatar(userId: number) {
    await this.storageManager.initializeIfNeeded();
    await this.storageManager.removeFolder(`${userId}/avatar`);
  }

  async remove(userId: number) {
    await this.storageManager.initializeIfNeeded();
    await this.storageManager.removeFolder(`${userId}`);
  }
}
