import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "../file.model";
import { MinioStorageManager } from "./minio-storage-manager";
import { IStoryStorageService, StoryUploadResult } from "../interfaces/story-storage.service";
import { StoryStorageHelper } from "../story-storage-helper";

@Injectable()
export class MinioStoryStorageService implements IStoryStorageService {
  private readonly storyStorageHelper: StoryStorageHelper;

  constructor(configService: ConfigService) {
    this.storyStorageHelper = new StoryStorageHelper(configService, new MinioStorageManager(configService, "stories"));
  }

  upload(file: BufferedFile, userId: number): Promise<StoryUploadResult> {
    return this.storyStorageHelper.upload(file, userId);
  }

  remove(userId: number) {
    return this.storyStorageHelper.remove(userId);
  }
}
