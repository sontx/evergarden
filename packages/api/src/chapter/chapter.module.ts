import { Module } from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { ChapterController } from "./chapter.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chapter } from "./chapter.entity";
import {StoryModule} from "../story/story.module";

@Module({
  imports: [TypeOrmModule.forFeature([Chapter]), StoryModule],
  providers: [ChapterService],
  controllers: [ChapterController],
})
export class ChapterModule {}
