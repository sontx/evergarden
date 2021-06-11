import { Injectable } from "@nestjs/common";
import config from "./config";
import * as fs from "fs";
import { Chapter, Link, Story } from "../story";
import * as path from "path";
import * as puppeteer from "puppeteer";
import { Browser } from "puppeteer";
import { TruyenfullBrowserService } from "./truyenfull-browser.service";
import { CommonService } from "../common.service";

@Injectable()
export class TruyenfullVerifyService extends CommonService {
  private dataDir = process.env.CRAWL_DATA_DIR;

  constructor(private truyenfullBrowserService: TruyenfullBrowserService) {
    super();
    console.log(`DATA DIR: ${this.dataDir}`);
  }

  checkMissingStories() {
    const linksContent = fs.readFileSync(config.allLinksFileName, { encoding: "utf8" });
    const links: Link[] = JSON.parse(linksContent) || [];
    const crawledFiles = fs.readdirSync(this.dataDir);
    const crawledLinks = [];
    crawledFiles.forEach((file) => {
      const filePath = path.resolve(this.dataDir, file);
      const content = fs.readFileSync(filePath, { encoding: "utf8" });
      const story = JSON.parse(content) as Story;
      const link = this.getStoryLink(story, links);
      if (!link) {
        console.log(`MISSING URL: ${file}`);
      } else {
        const foundLink = links.find((item) => item.link === link);
        if (foundLink) {
          crawledLinks.push(foundLink);
        } else {
          console.log(`NOT IN LINKS: ${file}`);
        }
      }
    });

    const missingLinks = links.filter((item) => !crawledLinks.indexOf(item));

    fs.writeFileSync(config.missingLinksFileName, JSON.stringify(missingLinks), { encoding: "utf8" });
  }

  async fixStories() {
    let browser: Browser;
    try {
      browser = await puppeteer.launch({ headless: true, defaultViewport: null });

      const linksContent = fs.readFileSync(config.allLinksFileName, { encoding: "utf8" });
      const links: Link[] = JSON.parse(linksContent) || [];

      const crawledFiles = fs.readdirSync(this.dataDir);
      let done = 0;
      for (const file of crawledFiles) {
        done++;
        this.setTerminalTitle(`${done}/${crawledFiles.length} [${file}]`);
        try {
          if (this.hasLine(config.verifiedLinksFileName, file)) {
            continue;
          }

          const filePath = path.resolve(this.dataDir, file);
          const content = fs.readFileSync(filePath, { encoding: "utf8" });
          const story = JSON.parse(content) as Story;
          if (!story.chapters) {
            story.chapters = [];
          }
          const fixedChapterCount = await this.fixStory(story, browser, links);
          if (fixedChapterCount > 0) {
            const fixedFilePath = path.resolve(config.fixedDataDir, file);
            fs.writeFileSync(fixedFilePath, JSON.stringify(story), { encoding: "utf8" });
          }

          this.appendLine(config.verifiedLinksFileName, file);
        } catch (e) {
          console.log(e);
          fs.writeFileSync(config.verifyErrorFileName, `${file} --> ${e.message}`);
        }
      }
    } finally {
      await browser.close();
    }
  }

  private getStoryLink(story: Story, fullLinks: Link[]): string | null {
    if (story.url) {
      return story.url;
    }
    if (!story.chapters || story.chapters.length === 0) {
      return null;
    }
    const testChapter = story.chapters[0];
    const chapterLink = testChapter.url;
    if (chapterLink) {
      const url = new URL(chapterLink);
      return `${url.origin}${url.pathname.substr(0, url.pathname.indexOf("/", 1) + 1)}`;
    } else {
      const foundLink = fullLinks.find((item) => item.title === story.title);
      if (foundLink) {
        return foundLink.link;
      }
    }
    return null;
  }

  private async fixStory(story: Story, browser: Browser, links: Link[]): Promise<number> {
    console.log(`CHECKING: ${story.title}`);

    const link = this.getStoryLink(story, links);
    if (!link) {
      console.log(`LINK IS NOT DEFINED: ${story.title}`);
    }

    const page = (await browser.pages())[0];
    await page.goto(link);
    const chapters = story.chapters || [];
    const chapterNos = chapters.filter((item) => !!item.content).map((item) => this.getChapterNo(item.fullTitle));

    let chapterPageIndex = 0;
    let fixedChapterCount = 0;
    do {
      const chaptersOfPage = await this.truyenfullBrowserService.getChapterPage(page);

      if (chaptersOfPage.length === 0) {
        console.log(`DONE: ${story.title} -> ${chapterPageIndex} without any chapters`);
        break;
      }

      const missingChapters = chaptersOfPage.filter((item) => {
        return !chapterNos.find((chapterNo) => chapterNo === this.getChapterNo(item.fullTitle));
      });

      if (missingChapters.length > 0) {
        console.log(`PAGE ${++chapterPageIndex}: ${missingChapters.length} missing chapters, start fixing...`);
        await this.fixMissingChapters(missingChapters, story, browser);
        console.log(`FIXED PAGE: ${chapterPageIndex}`);
        fixedChapterCount += missingChapters.length;
      } else {
        console.log(`PAGE ${++chapterPageIndex}: OK!`);
      }

      if (!(await this.hasElement(page, ".glyphicon.glyphicon-menu-right"))) {
        break;
      }
      await page.click(".glyphicon.glyphicon-menu-right");
      await this.delay(1000);
    } while (true);

    if (fixedChapterCount > 0) {
      console.log(`DONE: ${story.title} --> Fixed ${fixedChapterCount} chapters`);
    } else {
      console.log(`DONE: ${story.title} --> OK`);
    }

    return fixedChapterCount;
  }

  private async fixMissingChapters(missingChapters: Chapter[], story: Story, browser: Browser) {
    const chapters = story.chapters || [];
    for (const chapter of missingChapters) {
      chapter.content = await this.truyenfullBrowserService.getChapterContent(browser, chapter.url);
      const existingChapter = chapters.find(
        (item) => this.getChapterNo(item.fullTitle) === this.getChapterNo(chapter.fullTitle),
      );
      if (existingChapter) {
        existingChapter.content = chapter.content;
        console.log(`UPDATED: ${this.getChapterNo(chapter.fullTitle)}`);
      } else {
        chapters.push(chapter);
        console.log(`ADDED: ${this.getChapterNo(chapter.fullTitle)}`);
      }
    }
  }

  private getChapterNo(fullTitle: string): string {
    const index = fullTitle.indexOf(":");
    return index >= 0 ? fullTitle.substr(0, index) : fullTitle;
  }
}
