import { forwardRef, Module } from "@nestjs/common";
import { ReadingHistoryService } from "./reading-history.service";
import { ReadingHistoryController } from "./reading-history.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadingHistory } from "./reading-history.entity";
import { StoryModule } from "../story/story.module";
import { UserModule } from "../user/user.module";
import { UpdateReadingHistoryService } from "./update-reading-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReadingHistory]), forwardRef(() => StoryModule), forwardRef(() => UserModule)],
  providers: [ReadingHistoryService, UpdateReadingHistoryService],
  controllers: [ReadingHistoryController],
  exports: [ReadingHistoryService],
})
export class ReadingHistoryModule {}
