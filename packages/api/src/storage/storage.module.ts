import { Module } from "@nestjs/common";
import { StorageController } from "./storage.controller";
import { StoryStorageService } from "./story-storage.service";
import { UserStorageService } from "./user-storage.service";

@Module({
  imports: [],
  providers: [StoryStorageService, UserStorageService],
  controllers: [StorageController],
  exports: [StoryStorageService, UserStorageService],
})
export class StorageModule {}
