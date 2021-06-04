import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import imageSize from "image-size";
import { ConfigService } from "@nestjs/config";
import * as sharp from "sharp";
import * as imagemin from "imagemin";
import * as imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import { nanoid } from "nanoid";

@Injectable()
export class UploadService {
  private currentStorageDirIndex: number;

  constructor(private configService: ConfigService) {
    this.findLastStorageDir();
    this.generateNewStorageIfNeed().then();
  }

  private findLastStorageDir() {
    const uploadDir = this.configService.get("upload.dir");
    const storageDir = path.resolve(uploadDir, "storage");
    if (fs.existsSync(storageDir)) {
      const dirs = fs
        .readdirSync(storageDir, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => parseInt(dirent.name))
        .sort((v1, v2) => v2 - v1);
      this.currentStorageDirIndex = dirs[0] || 0;
    } else {
      this.currentStorageDirIndex = 0;
    }
  }

  private getCurrentStorageDir(): string {
    const name = `${this.currentStorageDirIndex}`.padStart(4, "0");
    const uploadDir = this.configService.get("upload.dir");
    return path.resolve(uploadDir, "storage", name);
  }

  private async generateNewStorageIfNeed(): Promise<void> {
    const maxFileCount = this.configService.get<number>("upload.maxFileCount");
    const storageDir = this.getCurrentStorageDir();
    await this.createDirIfNeeded(storageDir);
    return new Promise((resolve, reject) => {
      fs.readdir(storageDir, (err, files) => {
        if (err) {
          reject(err);
        } else {
          if (files.length >= maxFileCount) {
            this.currentStorageDirIndex++;
            const nextStorageDir = this.getCurrentStorageDir();
            fs.mkdir(nextStorageDir, (err1) => {
              if (err1) {
                reject(err1);
              } else {
                resolve();
              }
            });
          } else {
            resolve();
          }
        }
      });
    });
  }

  private createDirIfNeeded(dir: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!fs.existsSync(dir)) {
        fs.mkdir(dir, { recursive: true }, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  isTempThumbnail(file: string): boolean {
    if (file.endsWith(".cover.jpg") || file.endsWith(".thumbnail.jpg")) {
      return false;
    }

    if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(file)) {
      return false;
    }

    const uploadDir = path.resolve(this.configService.get("upload.dir"));
    const tempFilePath = path.resolve(uploadDir, "temp", file);
    return fs.existsSync(tempFilePath);
  }

  async deleteTempThumbnail(file: string): Promise<void> {
    const uploadDir = path.resolve(this.configService.get("upload.dir"));
    const tempFilePath = path.resolve(uploadDir, "temp", file);
    return new Promise<void>((resolve, reject) => {
      fs.unlink(tempFilePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async saveThumbnail(tempFileName: string): Promise<{ thumbnail: string; cover: string }> {
    const uploadDir = path.resolve(this.configService.get("upload.dir"));
    const maxCoverWidth = this.configService.get<number>("settings.sizing.cover.maxWidth");
    const thumbnailWidth = this.configService.get<number>("settings.sizing.thumbnail.width");
    const thumbnailHeight = this.configService.get<number>("settings.sizing.thumbnail.height");

    // Check if temp file exists
    const tempFilePath = path.resolve(uploadDir, "temp", tempFileName);
    if (!fs.existsSync(tempFilePath)) {
      throw new Error(`File ${tempFileName} not found`);
    }

    // Prepare storage dir
    await this.generateNewStorageIfNeed();
    const storageDir = this.getCurrentStorageDir();
    await this.createDirIfNeeded(storageDir);

    // Read temp file image info
    const info = imageSize(tempFilePath);
    let sharpObj = sharp(tempFilePath);

    // Convert temp file to jpg if needed
    if (info.type === "png") {
      sharpObj = sharpObj.toFormat("jpg");
    }

    // Make sure cover image's width is less than maxCoverWidth
    if (info.width > maxCoverWidth) {
      sharpObj = sharpObj.jpeg({ quality: 100, progressive: true }).resize({
        width: maxCoverWidth,
        height: Math.round((info.height * maxCoverWidth) / info.width),
      });
    }

    // Optimize and save cover image to file
    let coverBuffer = await sharpObj.toBuffer();
    coverBuffer = await this.optimizeImage(coverBuffer);
    const sharedName = nanoid();
    const coverFilePath = path.resolve(storageDir, `${sharedName}.cover.jpg`);
    await this.writeFileAsync(coverFilePath, coverBuffer);

    // Optimize and save thumbnail image to file
    sharpObj = sharpObj.resize({ width: thumbnailWidth, height: thumbnailHeight, fit: "cover" });
    let thumbnailBuffer = await sharpObj.toBuffer();
    thumbnailBuffer = await this.optimizeImage(thumbnailBuffer);
    const thumbnailFilePath = path.resolve(storageDir, `${sharedName}.thumbnail.jpg`);
    await this.writeFileAsync(thumbnailFilePath, thumbnailBuffer);

    sharpObj.destroy();

    return {
      thumbnail: path.relative(path.resolve(uploadDir, "storage"), thumbnailFilePath),
      cover: path.relative(path.resolve(uploadDir, "storage"), coverFilePath),
    };
  }

  private writeFileAsync(filePath: string, content: Buffer): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, content, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private async optimizeImage(content: Buffer): Promise<Buffer> {
    return await imagemin.buffer(content, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  }
}
