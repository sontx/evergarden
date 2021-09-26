import { IViewHitsCacheService } from "./interfaces/view-hits-cache.service";
import { ViewIncreasedEvent } from "../events/view-increased.event";

export abstract class AbstractViewHitsCacheService implements IViewHitsCacheService {
  protected batchId: "batch1" | "batch2" = "batch1";

  protected newBatch() {
    this.batchId = this.batchId === "batch1" ? "batch2" : "batch1";
  }

  abstract add(data: ViewIncreasedEvent): Promise<void>;

  abstract popAll(): Promise<ViewIncreasedEvent[]>;
}
