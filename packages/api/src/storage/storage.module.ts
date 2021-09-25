import { Module } from "@nestjs/common";
import { USER_STORAGE_SERVICE_KEY } from "./interfaces/user-storage.service";
import { STORY_STORAGE_SERVICE_KEY } from "./interfaces/story-storage.service";
import { LocalUserStorageService } from "./local/local-user-storage.service";
import { LocalStoryStorageService } from "./local/local-story-storage.service";
import { useDocker } from "../common/utils";
import { MinioUserStorageService } from "./minio/minio-user-storage.service";
import { MinioStoryStorageService } from "./minio/minio-story-storage.service";

@Module({
  providers: [
    {
      provide: USER_STORAGE_SERVICE_KEY,
      useClass: useDocker() ? MinioUserStorageService : LocalUserStorageService,
    },
    {
      provide: STORY_STORAGE_SERVICE_KEY,
      useClass: useDocker() ? MinioStoryStorageService : LocalStoryStorageService,
    },
  ],
  exports: [USER_STORAGE_SERVICE_KEY, STORY_STORAGE_SERVICE_KEY],
})
export class StorageModule {}
