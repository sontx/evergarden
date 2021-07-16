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
      useFactory: async (configService: ConfigService) => {
        const result = {
          node: configService.get("database.elastic.url"),
          auth: {
            username: configService.get("database.elastic.username"),
            password: configService.get("database.elastic.password"),
          },
          maxRetries: 3,
          sniffOnStart: true,
        };
        console.log(result)
        return result;
      },
      inject: [ConfigService],
    }),
    StorageModule,
  ],
  providers: [StorySearchService],
  exports: [ElasticsearchModule, StorySearchService],
  controllers: [SearchController],
})
export class SearchModule {}
