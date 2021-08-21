import { Module } from "@nestjs/common";
import { StoryStorageService } from "./story-storage.service";
import { UserStorageService } from "./user-storage.service";

@Module({
  imports: [],
  providers: [StoryStorageService, UserStorageService],
  exports: [StoryStorageService, UserStorageService],
})
export class StorageModule {}
