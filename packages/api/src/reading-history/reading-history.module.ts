import { forwardRef, Module } from "@nestjs/common";
import { ReadingHistoryService } from "./reading-history.service";
import { ReadingHistoryController } from "./reading-history.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReadingHistory } from "./reading-history.entity";
import { StoryModule } from "../story/story.module";
import { UserModule } from "../user/user.module";
import { UpdateBatchHistoryService } from "./update-batch-history.service";

@Module({
  imports: [TypeOrmModule.forFeature([ReadingHistory]), forwardRef(() => StoryModule), forwardRef(() => UserModule)],
  providers: [ReadingHistoryService, UpdateBatchHistoryService],
  controllers: [ReadingHistoryController],
  exports: [ReadingHistoryService],
})
export class ReadingHistoryModule {}
