import { Module } from "@nestjs/common";
import { ChapterService } from "./chapter.service";
import { ChapterController } from "./chapter.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Chapter } from "./chapter.entity";
import { StoryModule } from "../story/story.module";
import { UserModule } from "../user/user.module";
import { SendMailModule } from "../send-mail/send-mail.module";
import { ReportService } from "./report.service";

@Module({
  imports: [TypeOrmModule.forFeature([Chapter]), StoryModule, UserModule, SendMailModule],
  providers: [ChapterService, ReportService],
  controllers: [ChapterController],
})
export class ChapterModule {}
