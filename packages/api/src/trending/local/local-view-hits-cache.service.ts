import { Injectable } from "@nestjs/common";
import { ViewIncreasedEvent } from "../../events/view-increased.event";
import { AbstractViewHitsCacheService } from "../abstract-view-hits-cache.service";

@Injectable()
export class LocalViewHitsCacheService extends AbstractViewHitsCacheService {
  private cacheData: {
    [x: string]: ViewIncreasedEvent[];
  };

  constructor() {
    super();
  }

  add(data: ViewIncreasedEvent): Promise<void> {
    if (!this.cacheData[this.batchId]) {
      this.cacheData[this.batchId] = [];
    }
    this.cacheData[this.batchId].push(data);
    return Promise.resolve();
  }

  popAll(): Promise<ViewIncreasedEvent[]> {
    const batchId = this.batchId;
    this.newBatch();
    const result = this.cacheData[batchId] || [];
    delete this.cacheData[batchId];
    return Promise.resolve(result);
  }
}
