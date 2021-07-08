import { Injectable } from "@nestjs/common";
import fetch from "node-fetch";
import * as jsdom from "jsdom";
import { CommonService } from "../common.service";
import {RawChapter, RawStory} from "../story";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class TruyencvService extends CommonService {
  async getChapter(slug: string, chapterNo: number): Promise<RawChapter> {
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

  async getChapters(slug: string, fromChapterNo: number, toChapterNo: number): Promise<RawChapter[]> {
      const chapters = [];
      console.log(`Start getting ${toChapterNo - fromChapterNo} chapters from ${slug}`);
      for (let i = fromChapterNo; i <= toChapterNo; i++) {
          console.log(`GET ${i}`)
          try {
              const chapter = await this.getChapter(slug, i);
              chapters.push(chapter)
          } catch (e) {
              console.log(e);
          }
          await this.delay(500);
      }
      console.log("DONE!");
      return chapters;
  }

  async getStory(slug: string, fromChapterNo: number, toChapterNo: number) {
      const result = await this.getChapters(slug, fromChapterNo , toChapterNo);
      const story: RawStory = {
          url: `https://m.truyencv.vn/truyen/${slug}/`,
          title: slug,
          chapters: result,
          description: "",
          status: "",
          thumbnail: "",
          genres: "",
          authors: ""
      }
      fs.writeFileSync(path.resolve("data", `${slug}.json`), JSON.stringify(story), {encoding: "utf8"})
  }
}
