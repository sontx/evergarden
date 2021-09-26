import { forwardRef, Module } from "@nestjs/common";
import { StoryController } from "./story.controller";
import { StoryService } from "./story.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Story } from "./story.entity";
import { ReadingHistoryModule } from "../reading-history/reading-history.module";
import { UserModule } from "../user/user.module";
import { SearchModule } from "../search/search.module";
import { AuthorModule } from "../author/author.module";
import { GenreModule } from "../genre/genre.module";
import { StorageModule } from "../storage/storage.module";
import { VoteService } from "./vote.service";
import { TrendingModule } from "../trending/trending.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Story]),
    forwardRef(() => SearchModule),
    forwardRef(() => ReadingHistoryModule),
    forwardRef(() => UserModule),
    forwardRef(() => TrendingModule),
    AuthorModule,
    GenreModule,
    StorageModule,
  ],
  controllers: [StoryController],
  providers: [StoryService, VoteService],
  exports: [StoryService, VoteService],
})
export class StoryModule {}
