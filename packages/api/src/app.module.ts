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
import { StorageModule } from "./storage/storage.module";
import { RedisModule, RedisService } from "nestjs-redis";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { NestSessionOptions, SessionModule } from "nestjs-session";
import * as ConnectRedis from "connect-redis";
import * as session from "express-session";
import * as expressSession from "express-session";
import { nanoid } from "nanoid";
import { ViewcountModule } from "./viewcount/viewcount.module";
import { TrackerModule } from "./tracker/tracker.module";
import { SendMailModule } from "./send-mail/send-mail.module";
import { BullModule } from "@nestjs/bull";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { useMicroservices } from "./common/utils";
import ms = require("ms");

const RedisStore = useMicroservices() && ConnectRedis(session);

function configSession(configService: ConfigService): expressSession.SessionOptions {
  return {
    secret: configService.get("session.secret"),
    saveUninitialized: false,
    resave: false,
    genid(): string {
      return nanoid();
    },
  };
}

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      envFilePath: [".env.development.local", ".env.development"],
      load: [configuration],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: "mysql",
          host: configService.get("database.mysql.host"),
          port: configService.get("database.mysql.port"),
          username: configService.get("database.mysql.username"),
          password: configService.get("database.mysql.password"),
          database: configService.get("database.mysql.databaseName"),
          charset: "utf8mb4",
          isGlobal: true,
          logging: configService.get("isDevelopment"),
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: true,
          migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
          entities: [User, Story, Chapter, Author, Genre, ReadingHistory],
        };
      },
    }),
    useMicroservices() &&
      RedisModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          return {
            host: configService.get("database.redis.host"),
            port: configService.get("database.redis.port"),
            name: "evergarden",
          };
        },
      }),
    useMicroservices()
      ? SessionModule.forRootAsync({
          imports: [ConfigModule, RedisModule],
          inject: [ConfigService, RedisService],
          useFactory: async (configService: ConfigService, redisService: RedisService): Promise<NestSessionOptions> => {
            return {
              session: {
                store: new RedisStore({
                  client: redisService.getClient("evergarden"),
                  disableTouch: true,
                  ttl: ms(configService.get<string>("session.ttl")) / 1000,
                }),
                ...configSession(configService),
              },
            };
          },
        })
      : SessionModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService): Promise<NestSessionOptions> => {
            return {
              session: configSession(configService),
            };
          },
        }),
    useMicroservices() &&
      BullModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            redis: {
              host: configService.get("database.redis.host"),
              port: configService.get("database.redis.port"),
              name: "evergarden",
            },
            defaultJobOptions: {
              attempts: 3,
              removeOnComplete: true,
              removeOnFail: true,
            },
          };
        },
      }),
    EventEmitterModule.forRoot({ global: true }),
    AuthModule,
    UserModule,
    StoryModule,
    ChapterModule,
    ReadingHistoryModule,
    SearchModule,
    AuthorModule,
    GenreModule,
    StorageModule,
    ViewcountModule,
    TrackerModule,
    SendMailModule,
  ].filter(Boolean),
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
