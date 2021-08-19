import { Injectable } from "@nestjs/common";
import { DelayedQueueService } from "../common/delayed-queue.service";
import { OnEvent } from "@nestjs/event-emitter";
import { ConfigService } from "@nestjs/config";
import { RedisService } from "nestjs-redis";
import { Redis } from "ioredis";
import { ViewcountService } from "./viewcount.service";
import { TrackerReceivedEvent } from "../events/tracker-received.event";
import ms = require("ms");

class StorySession {
  constructor(public readonly sessionId: string, public readonly storyId: number) {}

  toString(): string {
    return `view:${this.sessionId}:${this.storyId}`;
  }
}

@Injectable()
export class HistoryChangedTrackerService extends DelayedQueueService<StorySession> {
  private readonly redisClient: Redis;
  private readonly ttl: number;

  constructor(
    private configService: ConfigService,
    private redisService: RedisService,
    private viewcountService: ViewcountService,
  ) {
    super();
    this.redisClient = this.redisService.getClient("evergarden");
    this.ttl = ms(this.configService.get<string>("session.ttl")) / 1000;
  }

  @OnEvent(TrackerReceivedEvent.name, { async: true })
  async handleHistoryChangedEvent(event: TrackerReceivedEvent) {
    await this.enqueue(new StorySession(event.sessionId, event.storyId), { triggerAt: event.triggerAt });
  }

  protected async onExecute(id: StorySession, { triggerAt }: { triggerAt: Date }): Promise<void> {
    if (!triggerAt || !this.redisClient) {
      return;
    }

    const key = id.toString();
    const lastTrigger = await this.redisClient.get(key);
    if (!lastTrigger) {
      await this.redisClient.set(key, triggerAt.toISOString(), "EX", this.ttl);
      this.viewcountService.enqueue(id.storyId, 1);
      return;
    }
  }

  protected onMerge(current: any, newValue: any): any {
    return newValue;
  }
}
