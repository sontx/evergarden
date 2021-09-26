import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "nestjs-redis";
import { Redis } from "ioredis";
import { ViewcountService } from "../viewcount.service";
import { AbstractHistoryChangedTrackerService, StorySession } from "../abstract-history-changed-tracker.service";

@Injectable()
export class RedisHistoryChangedTrackerService extends AbstractHistoryChangedTrackerService {
  private readonly redisClient: Redis;

  constructor(
    configService: ConfigService,
    private redisService: RedisService,
    private viewcountService: ViewcountService,
  ) {
    super(configService);
    this.redisClient = this.redisService.getClient("evergarden");
  }

  protected async onExecute(id: StorySession, { triggerAt }: { triggerAt: Date }): Promise<void> {
    if (!triggerAt || !this.redisClient) {
      return;
    }

    const key = id.toString();
    const lastTrigger = await this.redisClient.get(key);
    if (!lastTrigger) {
      await this.redisClient.set(key, triggerAt.toISOString(), "EX", this.viewCountIntervalInSeconds);
      this.viewcountService.enqueue(id.storyId, 1);
    }
  }
}
