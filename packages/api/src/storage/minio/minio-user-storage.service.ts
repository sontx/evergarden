import { Injectable } from "@nestjs/common";
import { MinioStorageManager } from "./minio-storage-manager";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "../file.model";
import { IUserStorageService } from "../interfaces/user-storage.service";
import { UserStorageHelper } from "../user-storage-helper";

@Injectable()
export class MinioUserStorageService implements IUserStorageService {
  private readonly userStorageHelper: UserStorageHelper;

  constructor(configService: ConfigService) {
    this.userStorageHelper = new UserStorageHelper(configService, new MinioStorageManager(configService, "users"));
  }

  upload(file: BufferedFile, userId: number): Promise<string> {
    return this.userStorageHelper.upload(file, userId);
  }

  removeAvatar(userId: number) {
    return this.userStorageHelper.removeAvatar(userId);
  }

  remove(userId: number) {
    return this.userStorageHelper.remove(userId);
  }
}
