import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BufferedFile } from "../file.model";
import { IStoryStorageService, StoryUploadResult } from "../interfaces/story-storage.service";
import { StoryStorageHelper } from "../story-storage-helper";
import { LocalStorageManager } from "./local-storage-manager";

@Injectable()
export class LocalStoryStorageService implements IStoryStorageService {
  private readonly storyStorageHelper: StoryStorageHelper;

  constructor(configService: ConfigService) {
    this.storyStorageHelper = new StoryStorageHelper(configService, new LocalStorageManager(configService, "stories"));
  }

  upload(file: BufferedFile, userId: number): Promise<StoryUploadResult> {
    return this.storyStorageHelper.upload(file, userId);
  }

  remove(userId: number) {
    return this.storyStorageHelper.remove(userId);
  }
}
