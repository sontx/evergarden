import { AbstractCrawlerService } from "../abstract-crawler.service";
import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";
import { removeVietnameseTones } from "../utils";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { Logger } from "@nestjs/common";

export class TruyenfullBrowserService extends AbstractCrawlerService {
  private total = 0;
  private done = 0;

  async getLinks(): Promise<void> {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    try {
      const page = (await browser.pages())[0];

      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (req.resourceType() == "image") {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto("https://truyenfull.vn/danh-sach/truyen-hot/", { timeout: 60000 });
      const list = [];
      do {
        const links = await page.evaluate(() => {
          const items = document.querySelectorAll(".list-truyen .row .truyen-title a") as NodeListOf<HTMLElement>;
          const ret = [];
          for (const item of items) {
            ret.push({
              title: item.innerText,
              link: item.getAttribute("href"),
            });
          }
          return ret;
        });
        list.push(...links);

        console.log(`${page.url()} -> ${links.length} stories`);
        fs.writeFileSync("backup.txt", page.url());

        try {
          await page.waitForSelector(".glyphicon.glyphicon-menu-right", { timeout: 10000 });
        } catch {
          console.log("out");
        }
        if (!(await this.hasElement(page, ".glyphicon.glyphicon-menu-right"))) {
          break;
        }

        await page.click(".glyphicon.glyphicon-menu-right");
        await this.delay(1000);
      } while (true);

      fs.writeFile("truyenfull.links", JSON.stringify(list, null, 2), { encoding: "utf8" }, (err) => {
        if (err) {
          Logger.error(err);
        } else {
          console.log("DONE!");
        }
      });
    } finally {
      await browser.close();
    }
  }

  async getStories(from: number, to: number, parallel: number): Promise<void> {
    const content = fs.readFileSync("truyenfull.links", { encoding: "utf8" });
    this.createFileLogIfNeeded();
    const log = fs.readFileSync("truyenfull.log", { encoding: "utf8" });
    const data = (JSON.parse(content) as { link: string; title: string }[]).filter((link) => !log.includes(link.link));
    const count = to - from + 1;
    this.total = count;
    this.done = 0;
    const batchSize = Math.floor(count / parallel);
    for (let step = 0; step < parallel; step++) {
      const start = from + batchSize * step;
      const end = step === parallel - 1 ? to + 1 : start + batchSize;
      const links = data.slice(start, end).map((link) => link.link);
      this.getBatch(links);
    }
  }

  private createFileLogIfNeeded() {
    if (!fs.existsSync("truyenfull.log")) {
      fs.writeFileSync("truyenfull.log", "");
    }
  }

  private async getBatch(links: string[]) {
    console.log("BATCH: " + links.length);
    for (const link of links) {
      this.createFileLogIfNeeded();
      const log = fs.readFileSync("truyenfull.log", { encoding: "utf8" });
      if (!log.includes(link)) {
        const story = await this.getStory(link);
        await this.saveStory(story);
        fs.appendFileSync("truyenfull.log", link + "\n", { encoding: "utf8" });
      } else {
        console.log("IGNORE: " + link);
      }

      this.done++;
    }

    if (this.done === this.total) {
      console.log("--------------------------- DONE ALL " + this.total);
    }
  }

  private async saveStory(story): Promise<void> {
    return new Promise((resolve, reject) => {
      const { took, ...rest } = story;
      const saveContent = JSON.stringify(rest);
      const fileName = `${removeVietnameseTones(story.title)}-[${uuidv4().substr(0, 8)}].txt`;
      fs.writeFile(path.resolve("data", fileName), saveContent, { encoding: "utf8" }, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`DONE -> ${story.title}, ${story.chapters.length} chapters, took ${took} seconds`);
          resolve();
        }
      });
    });
  }

  private async getStory(url: string) {
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    try {
      const start = new Date();

      console.log("START: " + url);

      const page = (await browser.pages())[0];
      await page.setUserAgent(this.randomUserAgent());
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        if (req.resourceType() == "image") {
          req.abort();
        } else {
          req.continue();
        }
      });

      await page.goto(url);
      const story = await page.evaluate(() => {
        const title = document.querySelector(".title").textContent;
        const thumbnail = document.querySelector(".books > div > img").getAttribute("src");
        const authors = document.querySelector(".info > div:nth-child(1)").textContent || "";
        const genres = document.querySelector(".info > div:nth-child(2)").textContent || "";
        const status = document.querySelector(".info .text-success")
          ? document.querySelector(".info .text-success").textContent
          : document.querySelector(".info .text-primary").textContent;
        const description = document.querySelector(".desc-text").textContent;
        return {
          title,
          thumbnail,
          authors: authors.replace("Tác giả:", ""),
          genresL: genres.replace("Thể loại:", ""),
          status,
          description,
          chapters: [],
        };
      });

      let chapterPageIndex = 0;
      do {
        const chaptersOfPage = await page.evaluate(() => {
          const items = document.querySelectorAll("#list-chapter .row li a") as NodeListOf<HTMLElement>;
          const ret = [];
          for (const item of items) {
            const fullTitle = item.innerText;
            const url = item.getAttribute("href");
            ret.push({
              fullTitle,
              url,
            });
          }
          return ret;
        });

        if (chaptersOfPage.length === 0) {
          console.log(`DONE: ${story.title} -> ${chapterPageIndex} without any chapters`);
          break;
        }

        story.chapters.push(...chaptersOfPage);
        if (!(await this.hasElement(page, ".glyphicon.glyphicon-menu-right"))) {
          break;
        }
        console.log(`START: ${story.title} -> ${++chapterPageIndex}`);
        for (const chapter of chaptersOfPage) {
          chapter.content = await this.getChapterContent(browser, chapter.url);
          delete chapter.url;
          await this.delay(500);
        }
        console.log(`DONE: ${story.title} -> ${chapterPageIndex}`);
        await page.click(".glyphicon.glyphicon-menu-right");
        await this.delay(1000);
      } while (true);

      console.log("DONE: " + url);

      return {
        ...story,
        took: ((new Date() as any) - (start as any)) / 1000,
      };
    } catch (e) {
      Logger.error("ERROR: " + url);
      console.error(e);
    } finally {
      // await browser.close();
    }
  }

  private async getChapterContent(browser: Browser, url: string): Promise<string> {
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      return await page.evaluate(() => {
        const element = document.querySelector("#chapter-c") as HTMLElement;
        if (element) {
          return element.innerText.replace(/\n\n/g, "\n");
        }
      });
    } finally {
      await page.close();
    }
  }
}
