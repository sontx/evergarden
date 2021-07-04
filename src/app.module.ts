import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AppService } from "./app.service";
import { TruyenfullBrowserService } from "./truyenfull/truyenfull-browser.service";
import { TruyenfullVerifyService } from "./truyenfull/truyenfull-verify.service";
import { StorySchema } from "./schemas/story.schema";
import { ChapterSchema } from "./schemas/chapter.schema";
import { AuthorSchema } from "./schemas/author.schema";
import { GenreSchema } from "./schemas/genre.schema";
import { UserSchema } from "./schemas/user.schema";
import {TruyencvService} from "./truyencv/truyencv.service";

@Module({
  imports: [
    MongooseModule.forRoot("mongodb://192.168.0.222:27017/evergarden"),
    MongooseModule.forFeature([
      { name: "stories", schema: StorySchema },
      { name: "chapters", schema: ChapterSchema },
      { name: "authors", schema: AuthorSchema },
      { name: "genres", schema: GenreSchema },
      { name: "users", schema: UserSchema },
    ]),
  ],
  providers: [AppService, TruyenfullBrowserService, TruyenfullVerifyService, TruyencvService],
})
export class AppModule {}
