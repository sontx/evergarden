import { Injectable } from "@nestjs/common";
import { Redis } from "ioredis";
import { RedisService } from "nestjs-redis";
import { ViewIncreasedEvent } from "../../events/view-increased.event";
import { AbstractViewHitsCacheService } from "../abstract-view-hits-cache.service";
import ms = require("ms");

@Injectable()
export class RedisViewHitsCacheService extends AbstractViewHitsCacheService {
  private readonly redisClient: Redis;

  constructor(private redisService: RedisService) {
    super();
    this.redisClient = this.redisService.getClient("evergarden");
  }

  async add(data: ViewIncreasedEvent): Promise<void> {
    await this.redisClient.set(
      `hits:${this.batchId}:${data.storyId}:${data.createdAt.getTime()}`,
      JSON.stringify(data),
      "EX",
      ms("2d"),
    );
  }

  async popAll(): Promise<ViewIncreasedEvent[]> {
    const batchId = this.batchId;
    this.newBatch();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, found] = await this.redisClient.scan(0, "MATCH", `hits:${batchId}:*`);
    const result: ViewIncreasedEvent[] = [];
    for (const key of found) {
      const stData = await this.redisClient.get(key);
      if (stData) {
        await this.redisClient.del(key);
        result.push(JSON.parse(stData));
      }
    }
    return result;
  }
}
