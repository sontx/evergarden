import { Page } from "puppeteer";

export abstract class AbstractCrawlerService {
  abstract getStories(from: number, to: number, parallel: number): Promise<void>;

  abstract getLinks(): Promise<void>;

  protected async hasElement(page: Page, selector: string): Promise<boolean> {
    return await page.evaluate((selector) => !!document.querySelector(selector), selector);
  }

  protected async delay(mills: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, mills);
    });
  }
}
