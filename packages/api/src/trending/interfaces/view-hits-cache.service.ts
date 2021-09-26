import { ViewIncreasedEvent } from "../../events/view-increased.event";

export const VIEW_HITS_CACHE_SERVICE_KEY = "ViewHitsCacheService";

export interface IViewHitsCacheService {
  add(data: ViewIncreasedEvent): Promise<void>;
  popAll(): Promise<ViewIncreasedEvent[]>;
}
