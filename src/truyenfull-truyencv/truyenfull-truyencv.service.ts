import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import fetch from "node-fetch";
import * as path from "path";
import * as puppeteer from "puppeteer";
import { RawChapter } from "../story";
import * as jsdom from "jsdom";
import { CommonService } from "../common.service";

@Injectable()
export class TruyenfullTruyencvService extends CommonService {
  async join() {
    const dir = path.resolve("dump", "target");
    const files = fs.readdirSync(dir);
    const splitFiles = files
      .filter((item) => item.endsWith("(Thượng).txt") || item.endsWith("(Hạ).txt"))
      .map((item) => {
        const temp = item.substr(item.indexOf("-") + 1);
        const temp1 = temp.substr(0, temp.lastIndexOf(".")).trim();
        const title = temp1.substr(0, temp1.lastIndexOf("(")).trim();
        return { file: path.resolve(dir, item), title, num: item.substr(0, item.indexOf("-")).trim() };
      });
    const items = {};
    splitFiles.forEach((value) => {
      console.log(value)
      if (!items[value.title]) {
        items[value.title] = {
          title: value.title,
          num: value.num,
          files: [value.file],
        };
      } else {
        items[value.title].files.push(value.file);
      }
    });

    for (const key of Object.keys(items)) {
      const item = items[key];
      if (item.files.length <= 1) {
        delete items[key];
      } else {
        const contents = [];
        item.files.forEach((file) => {
          contents.push(fs.readFileSync(file, { encoding: "utf8" }));
          fs.renameSync(file, path.resolve("dump", "target-backup", path.basename(file)));
        });
        const content = this.joinChapterContents(contents);
        fs.writeFileSync(path.resolve(path.dirname(item.files[0]), `${item.num} - ${item.title}.txt`), content, {
          encoding: "utf8",
        });
      }
    }
    console.log(splitFiles)
  }
  async join1() {
    const dir = path.resolve("dump", "target");
    const files = fs.readdirSync(dir);
    const splitFiles = files
      .filter((item) => /\([0-9]\)\.txt$/.test(item))
      .map((item) => {
        const temp = item.substr(item.indexOf("-") + 1);
        const temp1 = temp.substr(0, temp.lastIndexOf(".")).trim();
        const title = temp1.substr(0, temp1.lastIndexOf("(")).trim();
        return { file: path.resolve(dir, item), title, num: item.substr(0, item.indexOf("-")).trim() };
      });
    const items = {};
    splitFiles.forEach((value) => {
      console.log(value)
      if (!items[value.title]) {
        items[value.title] = {
          title: value.title,
          num: value.num,
          files: [value.file],
        };
      } else {
        items[value.title].files.push(value.file);
      }
    });

    for (const key of Object.keys(items)) {
      const item = items[key];
      if (item.files.length <= 1) {
        delete items[key];
      } else {
        const contents = [];
        item.files.forEach((file) => {
          contents.push(fs.readFileSync(file, { encoding: "utf8" }));
          fs.renameSync(file, path.resolve("dump", "target-backup", path.basename(file)));
        });
        const content = this.joinChapterContents(contents);
        fs.writeFileSync(path.resolve(path.dirname(item.files[0]), `${item.num} - ${item.title}.txt`), content, {
          encoding: "utf8",
        });
      }
    }
  }

  async crawl(sourceSlug: string, sourceStart: number, targetSlug: string, targetStart: number) {
    // return this.crawlSource(sourceSlug, sourceStart, 2);
    return Promise.all([this.crawlSource(sourceSlug, sourceStart, 2), this.crawlTarget(targetSlug, targetStart, 2)]);
  }

  async crawlSource(sourceSlug: string, sourceStart: number, retry: number) {
    let sourceIndex = sourceStart;
    try {
      while (true) {
        this.print(`SOURCE: ${sourceIndex}`, "#bada55");
        const sourceData = await this.getSource(sourceSlug, sourceIndex);
        await this.saveChapter(`${sourceIndex}`, sourceData.title, sourceData.content, "source");
        this.print(`SOURCE: ${sourceIndex} -> DONE`, "#bada55");
        sourceIndex++;
      }
    } catch (e) {
      console.log(e);
      if (retry > 0) {
        console.log("SOURCE --> RETRY");
        await this.crawlSource(sourceSlug, sourceIndex + 1, retry);
      } else {
        fs.writeFileSync(path.resolve("dump", "source.txt"), `${sourceIndex}`, { encoding: "utf8" });
        this.print("SOURCE ERROR -> STOP", "#bada55");
      }
    }
  }

  async crawlTarget(targetSlug: string, targetStart: number, retry: number) {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    let targetIndex = targetStart;
    try {
      const targetPage = (await browser.pages())[0];
      await targetPage.setUserAgent(this.randomUserAgent());
      await targetPage.setRequestInterception(true);
      targetPage.on("request", (req) => {
        if (req.resourceType() == "image") {
          req.abort();
        } else {
          req.continue();
        }
      });

      while (true) {
        this.print(`TARGET: ${targetIndex}`, "green");
        await targetPage.goto(`https://truyenfull.vn/${targetSlug}/chuong-${targetIndex}/`, {
          timeout: 120000,
        });
        const { targetTitle, targetContent } = await targetPage.evaluate(() => {
          const titleElement = document.querySelector("#chapter-big-container > div > div > h2 > a") as HTMLElement;
          const title = titleElement.innerText;
          const contentElement = document.querySelector("#chapter-c") as HTMLElement;
          const content = contentElement.innerText;
          return {
            targetContent: content,
            targetTitle: title.substring(title.lastIndexOf(":") + 1).trim(),
          };
        });

        await this.saveChapter(`${targetIndex}`, targetTitle, targetContent, "target");
        this.print(`TARGET: ${targetIndex} -> DONE`, "green");
        targetIndex++;
        await this.delay(1000);
      }
    } catch (e) {
      console.log(e);
      if (retry > 0) {
        console.log("TARGET --> RETRY");
        await browser.close();
        await this.crawlTarget(targetSlug, targetIndex + 1, retry);
      } else {
        fs.writeFileSync(path.resolve("dump", "target.txt"), `${targetIndex}`, { encoding: "utf8" });
      }
      this.print("TARGET ERROR -> STOP", "green");
    } finally {
      await browser.close();
    }
  }

  async getSource(slug: string, chapterNo: number): Promise<RawChapter> {
    const response = await fetch("https://m.truyencv.vn/graphql", {
      headers: {
        accept: "*/*",
        "accept-language": "en,en-US;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "content-type": "application/json",
        "sec-ch-ua": '" Not;A Brand";v="99", "Google Chrome";v="91", "Chromium";v="91"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        cookie:
          "_ga=GA1.1.1082771011.1625303472; csrftoken=32QM0q73X11SboTuaZIjUtp5B3nIOMJx6HtsOsWZzSWJlFWi5qhLFttYFfYtfae9; _ga_LZ34L5B3XN=GS1.1.1625303472.1.1.1625305176.0",
      },
      referrer: `https://m.truyencv.vn/truyen/${slug}/chuong-${chapterNo}/`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: `{\"id\":\"ChapterContentQuery\",\"query\":\"query ChapterContentQuery(\\n  $slug: String!\\n  $chapNum: Int!\\n) {\\n  ...ChapterContent_detail\\n  ...ChapterContent_book\\n}\\n\\nfragment ChapterContent_book on Query {\\n  book(slug: $slug) {\\n    edges {\\n      node {\\n        title\\n        slug\\n        refId\\n        url\\n        fullUrl\\n        lastChapter {\\n          chapNum\\n        }\\n        bookStatus\\n        numChapters\\n        coverLg\\n        id\\n      }\\n    }\\n  }\\n}\\n\\nfragment ChapterContent_detail on Query {\\n  chapter2(bookSlug: $slug, chapNum: $chapNum) {\\n    bookId\\n    bookSlug\\n    title\\n    chapNum\\n    contentHtml\\n    fullUrl\\n    url\\n    refId\\n    prevChapter {\\n      title\\n      url\\n      chapNum\\n      id\\n    }\\n    nextChapter {\\n      title\\n      url\\n      chapNum\\n      id\\n    }\\n  }\\n}\\n\",\"variables\":{\"slug\":\"${slug}\",\"chapNum\":\"${chapterNo}\"}}`,
      method: "POST",
      mode: "cors",
    });
    const json = await response.json();
    if (typeof json === "object") {
      const data = json.data[`chapter2`];
      if (data) {
        const { contentHtml, title } = data;
        if (contentHtml) {
          const dom = new jsdom.JSDOM(`<html><body>${contentHtml}</body></html>`);
          const document = dom.window.document;
          let content = document.documentElement.textContent.trim();
          if (content.startsWith("Người đăng: ")) {
            content = content.substr(content.indexOf("\n\n")).trim();
          }
          return {
            content,
            title,
            url: `https://m.truyencv.vn/truyen/${slug}/chuong-${chapterNo}/`,
            fullTitle: title,
          };
        }
      }
    }

    console.error(json);
    throw new Error(`ERROR: ${slug} - chapter ${chapterNo}`);
  }

  private saveChapter(num: string, title: string, content: string, dirName: string) {
    const dir = path.resolve("dump", dirName);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFileSync(
      path.resolve(dir, `${num.padStart(4, "0")} - ${title}.txt`.replace(/[/\\?%*:|"<>]/g, "")),
      content,
      {
        encoding: "utf8",
      },
    );
  }

  private joinChapterContents(chapters: string[]): string {
    if (chapters.length === 1) {
      return chapters[0];
    }

    let content = chapters[0].trim();
    for (let i = 1; i < chapters.length; i++) {
      const current = chapters[i].trim();
      if (current.endsWith(".")) {
        content += ".\n" + current;
      } else {
        content += "\n" + current;
      }
    }

    return content;
  }
}
