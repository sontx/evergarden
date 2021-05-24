import {forwardRef, Module} from "@nestjs/common";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Story } from "./story.entity";
import { ReadingHistoryModule } from "../reading-history/reading-history.module";

@Module({
  imports: [TypeOrmModule.forFeature([Story]), forwardRef(() => ReadingHistoryModule)],
  controllers: [StoryController],
  providers: [StoryService],
  exports: [StoryService],
})
export class StoryModule {}
