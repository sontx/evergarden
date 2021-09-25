import { forwardRef, Module } from "@nestjs/common";

import { ConfigModule, ConfigService } from "@nestjs/config";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import ElasticStorySearchService from "./elastic/elastic-story-search.service";
import ElasticAuthorSearchService from "./elastic/elastic-author-search.service";
import { STORY_SEARCH_SERVICE_KEY } from "./interfaces/story-search.service";
import { AUTHOR_SEARCH_SERVICE_KEY } from "./interfaces/author-search.service";
import { StoryModule } from "../story/story.module";
import { AuthorModule } from "../author/author.module";
import { LocalStorySearchService } from "./local/local-story-search.service";
import { LocalAuthorSearchService } from "./local/local-author-search.service";
import { useMicroservices } from "../common/utils";

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get("database.elastic.url"),
        auth: {
          username: configService.get("database.elastic.username"),
          password: configService.get("database.elastic.password"),
        },
        maxRetries: 3,
        sniffOnStart: true,
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => StoryModule),
    forwardRef(() => AuthorModule),
  ],
  providers: [
    {
      provide: STORY_SEARCH_SERVICE_KEY,
      useClass: useMicroservices() ? ElasticStorySearchService : LocalStorySearchService,
    },
    {
      provide: AUTHOR_SEARCH_SERVICE_KEY,
      useClass: useMicroservices() ? ElasticAuthorSearchService : LocalAuthorSearchService,
    },
  ],
  exports: [ElasticsearchModule, STORY_SEARCH_SERVICE_KEY, AUTHOR_SEARCH_SERVICE_KEY],
})
export class SearchModule {}
