import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Trending } from "./trending.entity";
import { ViewHitService } from "./view-hit.service";
import { forEachChunk, isDevelopment } from "../common/utils";
import { StoryService } from "../story/story.service";
import { GetStoryDto } from "@evergarden/shared";
import { Cron, CronExpression } from "@nestjs/schedule";

const AUTO_UPDATE_TRENDING_CRON = isDevelopment() ? CronExpression.EVERY_MINUTE : CronExpression.EVERY_10_MINUTES;

@Injectable()
export class TrendingService {
  private logger = new Logger(TrendingService.name);

  constructor(
    @InjectRepository(Trending)
    private trendingRepository: Repository<Trending>,
    private viewHitService: ViewHitService,
    private storyService: StoryService,
  ) {}

  @Cron(AUTO_UPDATE_TRENDING_CRON)
  private updateTrendingSchedule() {
    this.updateTrending().then();
  }

  async updateTrending(): Promise<void> {
    this.logger.debug("Updating trending");
    const viewHitScores = await this.viewHitService.getViewHitScores();
    if (viewHitScores.length > 0) {
      this.logger.debug(`Found ${viewHitScores.length} view hits`);
      await this.trendingRepository.manager.transaction(async (entityManager) => {
        await entityManager.query("DELETE FROM trending WHERE TRUE");
        await forEachChunk(viewHitScores, 1000, async (chunk) => {
          await entityManager.insert(Trending, chunk);
        });
      });
    } else {
      this.logger.debug("No view hit was found");
    }
  }

  async getTrending(limit: number, skip: number): Promise<GetStoryDto[]> {
    const trending = await this.trendingRepository.find({
      order: { score: "DESC" },
      skip,
      take: limit,
    });
    const stories = await this.storyService.getStoriesByIds(trending.map((item) => item.storyId));
    const result: GetStoryDto[] = [];
    for (const item of trending) {
      const found = stories.find((story) => story.id === item.storyId);
      if (found) {
        result.push(found);
      }
    }
    return result;
  }
}
