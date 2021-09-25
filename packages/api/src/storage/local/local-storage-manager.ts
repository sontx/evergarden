import { ConfigService } from "@nestjs/config";
import { Sharp } from "sharp";
import { AbstractStorageManager } from "../abstract-storage-manager";
import * as path from "path";
import * as fs from "fs";
import { writeFileAsync } from "../../common/utils";

const UPLOAD_DIR = "upload";

export class LocalStorageManager extends AbstractStorageManager {
  private readonly workingPath: string;
  private readonly relativeWorkingPath: string;
  private initialized = false;

  constructor(configService: ConfigService, workingDir: string) {
    super(configService);
    this.workingPath = path.resolve("client", UPLOAD_DIR, workingDir);
    this.relativeWorkingPath = path.join(UPLOAD_DIR, workingDir).replace(/\\/g, "/");
  }

  async initializeIfNeeded() {
    if (!this.initialized) {
      this.initialized = true;
      if (!fs.existsSync(this.workingPath)) {
        fs.mkdirSync(this.workingPath, { recursive: true });
      }
    }
  }

  buildUrl(name: string): string {
    return super.buildUrl(`${this.relativeWorkingPath}/${name}`);
  }

  async uploadAndReplace<T>(folderName: string, action: () => Promise<T>): Promise<T> {
    const uploadPath = path.resolve(this.workingPath, folderName);
    const files = fs.existsSync(uploadPath) ? await fs.promises.readdir(uploadPath) : [];
    const result = await action();
    for (const file of files) {
      const filePath = path.resolve(uploadPath, file);
      const stat = await fs.promises.lstat(filePath);
      if (stat.isFile()) {
        await fs.promises.unlink(filePath);
      }
    }
    return result;
  }

  async saveImage(fileName: string, sharp: Sharp): Promise<void> {
    const buffer = await this.optimizeImage(await sharp.toBuffer());
    const filePath = path.resolve(this.workingPath, fileName);
    await writeFileAsync(filePath, buffer);
  }

  async removeFolder(name: string): Promise<void> {
    const dirPath = path.resolve(this.workingPath, name);
    await fs.promises.rmdir(dirPath, { recursive: true });
  }
}
