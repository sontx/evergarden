import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as sharp from "sharp";
import { Sharp } from "sharp";
import imageSize from "image-size";
import * as imagemin from "imagemin";
import * as imageminJpegtran from "imagemin-jpegtran";
import imageminPngquant from "imagemin-pngquant";
import { Client } from "minio";
import { BufferedFile } from "./file.model";
import { ISizeCalculationResult } from "image-size/dist/types/interface";

const DEFAULT_REGION = "ap-southeast-1";
const THUMBNAIL_BUCKET = "thumbnails";
const COVER_BUCKET = "covers";

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly client: Client;

  constructor(private configService: ConfigService) {
    this.client = new Client({
      endPoint: configService.get("storage.minio.host"),
      port: configService.get("storage.minio.port"),
      useSSL: !!configService.get("storage.minio.useSSL"),
      accessKey: configService.get("storage.minio.accessKey"),
      secretKey: configService.get("storage.minio.secretKey"),
    });
  }

  async initialize() {
    await this.createBucket(THUMBNAIL_BUCKET, true);
    await this.createBucket(COVER_BUCKET, true);
  }

  async upload(
    file: BufferedFile,
    name: string,
  ): Promise<{
    thumbnail: string;
    cover: string;
  }> {
    if (!(file.mimetype.includes("jpeg") || file.mimetype.includes("png"))) {
      throw new BadRequestException("File type not supported");
    }

    const info = imageSize(file.buffer);
    let originSharp = sharp(file.buffer);
    let coverSharp: Sharp;
    let thumbnailSharp: Sharp;

    try {
      // Convert file to jpg if needed
      if (info.type === "png") {
        originSharp = originSharp.toFormat("jpg");
      }

      const fileName = `${name}.jpg`;
      const metaData = {
        "Content-Type": "image/jpeg",
      };

      coverSharp = await this.saveCover(originSharp, info, fileName, metaData);
      thumbnailSharp = await this.saveThumbnail(originSharp, fileName, metaData);

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

  private async saveCover(originSharp: Sharp, info: ISizeCalculationResult, fileName: string, metaData: any) {
    const maxCoverWidth = this.configService.get<number>("settings.sizing.cover.maxWidth");
    const coverSharp =
      info.width > maxCoverWidth
        ? originSharp.jpeg({ quality: 100, progressive: true }).resize({
            width: maxCoverWidth,
            height: Math.round((info.height * maxCoverWidth) / info.width),
          })
        : originSharp;
    const coverBuffer = await this.optimizeImage(await coverSharp.toBuffer());
    await this.client.putObject(COVER_BUCKET, fileName, coverBuffer, metaData);
    return coverSharp;
  }

  private async saveThumbnail(originSharp: Sharp, fileName: string, metaData: any) {
    const thumbnailWidth = this.configService.get<number>("settings.sizing.thumbnail.width");
    const thumbnailHeight = this.configService.get<number>("settings.sizing.thumbnail.height");
    const thumbnailSharp = originSharp.resize({
      width: thumbnailWidth,
      height: thumbnailHeight,
      fit: "cover",
    });
    const thumbnailBuffer = await this.optimizeImage(await thumbnailSharp.toBuffer());
    await this.client.putObject(THUMBNAIL_BUCKET, fileName, thumbnailBuffer, metaData);
    return thumbnailSharp;
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

  private async createBucket(name: string, publish: boolean) {
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
