import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "minio";
import { Sharp } from "sharp";
import { AbstractStorageManager } from "../abstract-storage-manager";

const DEFAULT_REGION = "ap-southeast-1";

export class MinioStorageManager extends AbstractStorageManager {
  private readonly logger = new Logger(MinioStorageManager.name);
  private readonly client: Client;
  private initialized = false;

  constructor(configService: ConfigService, private readonly bucket: string, private readonly publishBucket = true) {
    super(configService);
    this.client = new Client({
      endPoint: configService.get("storage.minio.host"),
      port: configService.get("storage.minio.port"),
      useSSL: !!configService.get("storage.minio.useSSL"),
      accessKey: configService.get("storage.minio.accessKey"),
      secretKey: configService.get("storage.minio.secretKey"),
    });
  }

  async initializeIfNeeded() {
    if (!this.initialized) {
      this.initialized = true;
      await this.createBucketIfNeeded(this.bucket, this.publishBucket);
    }
  }

  buildUrl(name: string): string {
    return super.buildUrl(`${this.bucket}/${name}`);
  }

  async saveImage(fileName: string, sharp: Sharp): Promise<void> {
    const buffer = await this.optimizeImage(await sharp.toBuffer());
    await this.client.putObject(this.bucket, fileName, buffer, {
      "Content-Type": "image/jpeg",
    });
  }

  private async createBucketIfNeeded(name: string, publish: boolean) {
    if (await this.client.bucketExists(name)) {
      return;
    }

    await this.client.makeBucket(name, DEFAULT_REGION);
    if (publish) {
      const policy = {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "PublicRead",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${name}/*`],
          },
        ],
      };
      await this.client.setBucketPolicy(name, JSON.stringify(policy));
    }

    this.logger.debug(`Create new bucket ${name}, public policy: ${publish}`);
  }

  async removeFolder(name: string): Promise<void> {
    const files = await this.getFiles(name);
    for (const file of files) {
      await this.client.removeObject(this.bucket, file);
    }
  }

  async uploadAndReplace<T>(folderName: string, action: () => Promise<T>): Promise<T> {
    const files = await this.getFiles(folderName);
    const result = await action();
    for (const file of files) {
      await this.client.removeObject(this.bucket, file);
    }
    return result;
  }

  private getFiles(folderName: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      const pipe = this.client.listObjects(this.bucket, `${folderName}/`, true);
      const files = [];
      pipe.on("data", async (item) => {
        files.push(item.name);
      });
      pipe.on("end", () => resolve(files));
      pipe.on("error", reject);
    });
  }
}
