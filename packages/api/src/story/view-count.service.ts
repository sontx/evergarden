import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Story } from "./story.entity";
import { Repository } from "typeorm";
import { DelayedQueueService } from "../common/delayed-queue.service";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "nestjs-redis";
import ms = require("ms");

export class ViewCountIdentity {
  constructor(readonly userId, readonly storyId) {}
  toString(): string {
    return `${this.userId}-${this.storyId}`;
  }
}

@Injectable()
export class ViewCountService extends DelayedQueueService<ViewCountIdentity> {
  constructor(
    @InjectRepository(Story) private storyRepository: Repository<Story>,
    private configService: ConfigService,
    private redisService: RedisService,
  ) {
    super();
  }

  protected async onExecute(id: ViewCountIdentity, { triggerAt }: { triggerAt: Date }): Promise<void> {
    if (!triggerAt) {
      return;
    }

    const client = this.redisService.getClient("evergarden");
    if (!client) {
      return;
    }

    const lastTriggerKey = `${id}-lastTrigger`;
    const lastCountKey = `${id}-lastCount`;
    const lastTriggerSt = await client.get(lastTriggerKey);
    const lastCountSt = await client.get(lastCountKey);

    if (!lastTriggerSt) {
      await client.set(lastTriggerKey, triggerAt.toISOString(), "EX", 60 * 60); // expire in 1 hour
    } else {
      const lastTriggerDate = new Date(lastTriggerSt);
      const lastCountDate = lastCountSt ? new Date(lastCountSt) : undefined;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const duration = triggerAt - lastTriggerDate;
      const minReading = ms(this.configService.get<string>("policy.viewCount.minReading"));
      if (duration < minReading) {
        return;
      }

      if (lastTriggerDate) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const lastCountDuration = triggerAt - lastCountDate;
        const minReadingInterval = ms(this.configService.get<string>("policy.viewCount.minReadingInterval"));
        if (lastCountDuration < minReadingInterval) {
          return;
        }
      }

      this.increaseViewCount(id.storyId);
      await client.set(lastCountSt, triggerAt.toISOString());
    }
  }

  private increaseViewCount(storyId: number) {
    console.log(`Increase view count for ${storyId}`);
  }

  protected onMerge(current: any, newValue: any): any {
    return newValue;
  }
}
