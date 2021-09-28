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
    const result: ViewIncreasedEvent[] = [];
    const readKeys: string[] = [];

    const doPopAll = async (cursor: string | number) => {
      const [nextCursor, found] = await this.redisClient.scan(cursor, "MATCH", `hits:${batchId}:*`);
      for (const key of found) {
        const stData = await this.redisClient.get(key);
        if (stData && !readKeys.includes(key)) {
          await this.redisClient.del(key);
          result.push(JSON.parse(stData));
          readKeys.push(key);
        }
      }

      const validCursor = parseInt(`${nextCursor}`);
      if (validCursor > 0) {
        await doPopAll(validCursor);
      }
    };

    await doPopAll(0);
    return result;
  }
}
