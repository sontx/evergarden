import { CommonService } from "./common.service";

export abstract class AbstractCrawlerService extends CommonService {
  abstract getStories(from: number, to: number, parallel: number): Promise<void>;

  abstract getLinks(): Promise<void>;
}
