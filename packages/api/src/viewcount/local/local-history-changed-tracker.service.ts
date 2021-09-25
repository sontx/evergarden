import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ViewcountService } from "../viewcount.service";
import { AbstractHistoryChangedTrackerService, StorySession } from "../abstract-history-changed-tracker.service";
import { InmemoryCache } from "../../common/inmemory-cache";

@Injectable()
export class LocalHistoryChangedTrackerService extends AbstractHistoryChangedTrackerService {
  private readonly cache = new InmemoryCache();

  constructor(configService: ConfigService, private viewcountService: ViewcountService) {
    super(configService);
    this.cache.start();
  }

  protected async onExecute(id: StorySession, { triggerAt }: { triggerAt: Date }): Promise<void> {
    if (!triggerAt) {
      return;
    }

    const key = id.toString();
    const lastTrigger = this.cache.get(key);
    if (!lastTrigger) {
      await this.cache.set(key, triggerAt.toISOString(), { ttl: this.viewCountIntervalInSeconds * 1000 });
      this.viewcountService.enqueue(id.storyId, 1);
    }
  }
}
