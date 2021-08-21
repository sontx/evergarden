import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { StorageController } from "./storage.controller";
import { StoryStorageService } from "./story-storage.service";

@Module({
  imports: [],
  providers: [StoryStorageService],
  controllers: [StorageController],
  exports: [StoryStorageService],
})
export class StorageModule {}
