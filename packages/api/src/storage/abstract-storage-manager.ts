import { BadRequestException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as imagemin from "imagemin";
import * as imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import { Sharp } from "sharp";
import { nanoid } from "nanoid";
import { BufferedFile } from "./file.model";
import { IStorageManager } from "./interfaces/storage-manager";

export abstract class AbstractStorageManager implements IStorageManager {
  protected constructor(protected readonly configService: ConfigService) {}

  buildUrl(name: string): string {
    const host = this.configService.get<string>("storage.host");
    return host.endsWith("/") ? `${host}${name}` : `${host}/${name}`;
  }

  async optimizeImage(content: Buffer): Promise<Buffer> {
    return await imagemin.buffer(content, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  }

  validateFileImage(file: BufferedFile) {
    if (!(file.mimetype.includes("jpeg") || file.mimetype.includes("png"))) {
      throw new BadRequestException("File type not supported");
    }
  }

  async resizeImage(sharp: Sharp, preferWidth: number, preferHeight?: number): Promise<Sharp> {
    const metadata = await sharp.metadata();
    if (preferHeight === undefined) {
      return metadata.width > preferWidth
        ? sharp.resize({
            width: preferWidth,
            height: Math.round((metadata.height * preferWidth) / metadata.width),
          })
        : sharp;
    }
    return sharp.resize({ width: preferWidth, height: preferHeight });
  }

  randomImageFileName(): string {
    return `${nanoid()}.jpg`;
  }

  abstract initializeIfNeeded(): Promise<void>;

  abstract removeFolder(name: string): Promise<void>;

  abstract saveImage(fileName: string, sharp: Sharp): Promise<void>;

  abstract uploadAndReplace<T>(folderName: string, action: () => Promise<T>): Promise<T>;
}
