import { forwardRef, Module } from "@nestjs/common";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Story } from "./story.entity";
import { ReadingHistoryModule } from "../reading-history/reading-history.module";
import { UserModule } from "../user/user.module";
import StorySearchService from "./story-search.service";
import { SearchModule } from "../search/search.module";
import { AuthorModule } from "../author/author.module";
import { GenreModule } from "../genre/genre.module";
import {UploadModule} from "../upload/upload.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Story]),
    SearchModule,
    forwardRef(() => ReadingHistoryModule),
    forwardRef(() => UserModule),
    AuthorModule,
    GenreModule,
    UploadModule
  ],
  controllers: [StoryController],
  providers: [StoryService, StorySearchService],
  exports: [StoryService],
})
export class StoryModule {}
