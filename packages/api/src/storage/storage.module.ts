import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { StorageController } from "./storage.controller";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as multer from "multer";
import { nanoid } from "nanoid";
import * as fs from "fs";
import * as path from "path";

const MAX_UPLOAD_FILE_SIZE = 3 * 1024 * 1024;

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uploadDir = configService.get("upload.dir");
        return {
          storage: multer.diskStorage({
            destination: function (req, file, cb) {
              const tempDir = path.resolve(uploadDir, "temp");
              if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
              }
              cb(null, tempDir);
            },
            filename: function (req, file, cb) {
              const ext = file.mimetype === "image/jpeg" ? "jpg" : "png";
              const tempName = `${nanoid()}.${ext}`;
              cb(null, tempName);
            },
          }),
          limits: {
            fileSize: MAX_UPLOAD_FILE_SIZE,
          },
          fileFilter: (req, file, callback) => {
            if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
              callback(new Error("Only either jpeg or png are accepted"), false);
            } else if (file.size > MAX_UPLOAD_FILE_SIZE) {
              callback(new Error(`Upload file size is over ${MAX_UPLOAD_FILE_SIZE} bytes`), false);
            }
            callback(null, true);
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService],
})
export class StorageModule {}
