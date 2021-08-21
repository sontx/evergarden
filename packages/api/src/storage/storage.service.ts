import { BadRequestException, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as imagemin from "imagemin";
import * as imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import { Client } from "minio";
import { BufferedFile } from "./file.model";
import { Sharp } from "sharp";

const DEFAULT_REGION = "ap-southeast-1";

export abstract class StorageService {
  private readonly logger = new Logger(StorageService.name);
  protected readonly client: Client;
  private initialized = false;

  protected constructor(protected readonly configService: ConfigService) {
    this.client = new Client({
      endPoint: configService.get("storage.minio.host"),
      port: configService.get("storage.minio.port"),
      useSSL: !!configService.get("storage.minio.useSSL"),
      accessKey: configService.get("storage.minio.accessKey"),
      secretKey: configService.get("storage.minio.secretKey"),
    });
  }

  protected abstract onInitialize(): Promise<void>;

  protected async initializeIfNeeded() {
    if (this.initialized) {
      this.initialized = true;
      await this.onInitialize();
    }
  }

  protected async optimizeImage(content: Buffer): Promise<Buffer> {
    return await imagemin.buffer(content, {
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
  }

  protected validateFileImage(file: BufferedFile) {
    if (!(file.mimetype.includes("jpeg") || file.mimetype.includes("png"))) {
      throw new BadRequestException("File type not supported");
    }
  }

  protected async resizeImage(sharp: Sharp, preferWidth: number, preferHeight?: number): Promise<Sharp> {
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

  protected async saveImage(bucket: string, fileName: string, sharp: Sharp): Promise<void> {
    const buffer = await this.optimizeImage(await sharp.toBuffer());
    await this.client.putObject(bucket, fileName, buffer, {
      "Content-Type": "image/jpeg",
    });
  }

  protected async createBucketIfNeeded(name: string, publish: boolean) {
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
}
