import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "../file.model";
import { IUserStorageService } from "../interfaces/user-storage.service";
import { UserStorageHelper } from "../user-storage-helper";
import { LocalStorageManager } from "./local-storage-manager";

@Injectable()
export class LocalUserStorageService implements IUserStorageService {
  private readonly userStorageHelper: UserStorageHelper;

  constructor(configService: ConfigService) {
    this.userStorageHelper = new UserStorageHelper(configService, new LocalStorageManager(configService, "users"));
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
