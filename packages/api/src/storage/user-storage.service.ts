import { BadRequestException, Injectable } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "./file.model";
import * as sharp from "sharp";

@Injectable()
export class UserStorageService extends StorageService {
  constructor(configService: ConfigService) {
    super(configService, "users");
  }

  async upload(file: BufferedFile, userId: number): Promise<string> {
    await this.initializeIfNeeded();
    this.validateFileImage(file);

    const sharpObj = sharp(file.buffer);
    try {
      const avatarFolder = `${userId}/avatar`;
      return await this.removeOldFilesAfterAction(avatarFolder, async () => {
        const width = this.configService.get<number>("settings.sizing.avatar.width");
        const height = this.configService.get<number>("settings.sizing.avatar.height");
        const resizedSharp = await this.resizeImage(sharpObj, width, height);
        const fileName = `${avatarFolder}/${this.randomImageFileName()}`;
        await this.saveImage(fileName, resizedSharp);
        return this.buildUrl(`${this.bucket}/${fileName}`);
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException("Error uploading file");
    } finally {
      sharpObj?.destroy();
    }
  }

  async remove(userId: number) {
    await this.initializeIfNeeded();
    await this.removeFolder(`${userId}`);
  }
}
