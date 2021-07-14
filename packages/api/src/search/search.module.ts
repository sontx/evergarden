import { Module } from "@nestjs/common";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { SearchController } from "./search.controller";
import StorySearchService from "./story-search.service";
import { StorageModule } from "../storage/storage.module";

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get("search.elastic.url"),
        auth: {
          username: configService.get("search.elastic.username"),
          password: configService.get("search.elastic.password"),
        },
        maxRetries: 3,
        sniffOnStart: true,
      }),
      inject: [ConfigService],
    }),
    StorageModule,
  ],
  providers: [StorySearchService],
  exports: [ElasticsearchModule, StorySearchService],
  controllers: [SearchController],
})
export class SearchModule {}
