import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import configuration from "./configuration";
import { UserModule } from "./user/user.module";
import { StoryModule } from "./story/story.module";
import { ChapterModule } from "./chapter/chapter.module";
import { ReadingHistoryModule } from "./reading-history/reading-history.module";
import { SearchModule } from "./search/search.module";
import { AuthorModule } from "./author/author.module";
import { GenreModule } from "./genre/genre.module";
import { User } from "./user/user.entity";
import { Story } from "./story/story.entity";
import { Chapter } from "./chapter/chapter.entity";
import { Author } from "./author/author.entity";
import { Genre } from "./genre/genre.entity";
import { ReadingHistory } from "./reading-history/reading-history.entity";
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: [".env.development.local", ".env.development"],
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "mongodb",
          url: configService.get("database.mongodb.connectionString"),
          database: configService.get("database.mongodb.databaseName"),
          ssl: true,
          useUnifiedTopology: true,
          useNewUrlParser: true,
          isGlobal: true,
          synchronize: true,
          entities: [User, Story, Chapter, Author, Genre, ReadingHistory],
        };
      },
    }),
    AuthModule,
    UserModule,
    StoryModule,
    ChapterModule,
    ReadingHistoryModule,
    SearchModule,
    AuthorModule,
    GenreModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
