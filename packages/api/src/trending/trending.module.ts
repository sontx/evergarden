import { forwardRef, Module } from "@nestjs/common";
import { TrendingService } from "./trending.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Trending } from "./trending.entity";
import { ViewHit } from "./view-hit.entity";
import { ViewHitService } from "./view-hit.service";
import { StoryModule } from "../story/story.module";
import { RedisViewHitsCacheService } from "./redis/redis-view-hits-cache.service";
import { VIEW_HITS_CACHE_SERVICE_KEY } from "./interfaces/view-hits-cache.service";
import { useMicroservices } from "../common/utils";
import { LocalViewHitsCacheService } from "./local/local-view-hits-cache.service";

@Module({
  imports: [TypeOrmModule.forFeature([Trending, ViewHit]), forwardRef(() => StoryModule)],
  providers: [
    TrendingService,
    ViewHitService,
    {
      provide: VIEW_HITS_CACHE_SERVICE_KEY,
      useClass: useMicroservices() ? RedisViewHitsCacheService : LocalViewHitsCacheService,
    },
  ],
  exports: [TrendingService],
})
export class TrendingModule {}
