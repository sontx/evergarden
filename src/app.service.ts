import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { Story, StoryDocument } from "./schemas/story.schema";
import { Chapter, ChapterDocument } from "./schemas/chapter.schema";
import { RawStory } from "./story";
import * as fs from "fs";
import { AuthorDocument } from "./schemas/author.schema";
import { GenreDocument } from "./schemas/genre.schema";
import { stringToSlug } from "./slug";
import { UserDocument } from "./schemas/user.schema";
import * as path from "path";
import { CommonService } from "./common.service";

@Injectable()
export class AppService extends CommonService {
  private user: UserDocument;

  constructor(
    @InjectModel("stories") private storyModel: Model<StoryDocument>,
    @InjectModel("chapters") private chapterModel: Model<ChapterDocument>,
    @InjectModel("authors") private authorModel: Model<AuthorDocument>,
    @InjectModel("genres") private genreModel: Model<GenreDocument>,
    @InjectModel("users") private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async init() {
    let user = await this.userModel.findOne({ email: "xuanson33bk@gmail.com" });
    if (!user) {
      const model = await this.userModel.create({
        email: "xuanson33bk@gmail.com",
        fullName: "Tran Xuan Son",
        role: "admin",
      });
      user = await model.save();
    }
    this.user = user;
  }

  async importStories(dir: string) {
    const files = fs.readdirSync(dir);
    let imported = 0;
    let skip = 0;
    let error = 0;
    console.log(`Start importing ${files.length} stories from ${dir}`);
    for (const file of files) {
      console.log(file);
      this.setTerminalTitle(`Importing [${imported + skip}/${files.length}]`);
      try {
        const rawStory = await this.readRawStory(path.resolve(dir, file));
        if (await this.shouldSaveStory(rawStory)) {
          await this.saveRawStory(rawStory);
          imported++;
        } else {
          console.log(`SKIP: ${file}`);
          skip++;
        }
      } catch (e) {
        console.log(`ERROR: ${file}`);
        this.appendLine("import-error.log", file);
        console.log(e);
        error++;
      }
      // console.log(rawStory.chapters.map((item) => `${item?.fullTitle} ---> ${item.title}`).join("\n"));
    }
    console.log(`IMPORTED ${imported}, SKIP ${skip}, ERROR ${error}!`);
  }

  private async saveAuthorIfNeeded(name: string): Promise<AuthorDocument> {
    const found = await this.authorModel.findOne({ name });
    if (found) {
      return found;
    }
    const model = await this.authorModel.create({ name });
    console.log(`Save new author: ${name}`);
    return await model.save();
  }

  private async saveGenreIfNeeded(name: string): Promise<GenreDocument> {
    const found = await this.genreModel.findOne({ name });
    if (found) {
      return found;
    }
    const model = await this.genreModel.create({ name });
    console.log(`Save new genre: ${name}`);
    return await model.save();
  }

  private async saveStory(story: Partial<Story>): Promise<StoryDocument> {
    const model = await this.storyModel.create(story);
    return await model.save();
  }

  private async saveChapter(chapter: Partial<Chapter>) {
    const model = await this.chapterModel.create(chapter);
    await model.save();
  }

  private readRawStory(file: string): RawStory {
    const content = fs.readFileSync(file, { encoding: "utf8" });
    const raw = JSON.parse(content) as RawStory;
    const chapters = raw.chapters || [];
    const sortedChapters = [];
    if (chapters.length > 1 && chapters[0].fullTitle.startsWith("Quyển")) {
      const hasNextBook = (nextBook, nextChapter) => {
        const test =
          nextChapter === undefined ? `Quyển ${nextBook} - Chương 1` : `Quyển ${nextBook} - Chương ${nextChapter}`;
        return chapters.find((item) => item.fullTitle === test || item.fullTitle.startsWith(test + ":"));
      };

      let book = 1;
      let chapterNo = 1;
      let continuousNo = 1;
      for (let i = 0; i < chapters.length; i++) {
        const chapterTitle = `Quyển ${book} - Chương ${chapterNo}`;
        const foundIndex = chapters.findIndex((item) => item.fullTitle.startsWith(chapterTitle));
        if (foundIndex === -1) {
          book++;
          if (hasNextBook(book, undefined)) {
            chapterNo = 1;
          } else if (hasNextBook(book, chapterNo)) {
          } else {
            throw new Error(`Chapter not found when sorting: ${file} --> ${continuousNo} --> search: ${chapterTitle}`);
          }
          continue;
        }
        const chapter = chapters[foundIndex];
        chapters.splice(foundIndex, 1);
        chapterNo++;
        const extractedTitle = this.extractRealChapterTitle(chapter.fullTitle);
        sortedChapters.push({
          ...chapter,
          title: extractedTitle ? `Chương ${continuousNo++}: ${extractedTitle}` : `Chương ${continuousNo++}`,
        });
      }
    } else {
      for (let i = 0; i < chapters.length; i++) {
        const test = `Chương ${i + 1}`;
        const foundIndex = chapters.findIndex(
          (item) => item.fullTitle === test || item.fullTitle.startsWith(test + ":"),
        );
        if (foundIndex === -1) {
          throw new Error(`Chapter not found when sorting: ${file} --> ${i + 1}`);
        }
        const chapter = chapters[foundIndex];
        chapters.splice(foundIndex, 1);
        sortedChapters.push({
          ...chapter,
          title: chapter.fullTitle,
        });
      }
    }

    return {
      ...raw,
      title: raw.title.trim(),
      chapters: sortedChapters,
    };
  }

  private async shouldSaveStory(rawStory: RawStory): Promise<boolean> {
    return !(await this.storyModel.findOne({ title: rawStory.title }));
  }

  private async saveRawStory(rawStory: RawStory) {
    const rawAuthors = this.extractParts(rawStory.authors);
    const rawGenres = this.extractParts(rawStory.genres);
    const authors: AuthorDocument[] = [];
    for (const rawAuthor of rawAuthors) {
      const author = await this.saveAuthorIfNeeded(rawAuthor);
      authors.push(author);
    }
    const genres: GenreDocument[] = [];
    for (const rawGenre of rawGenres) {
      const genre = await this.saveGenreIfNeeded(rawGenre);
      genres.push(genre);
    }

    const story: Story = {
      url: stringToSlug(rawStory.title),
      genres: genres.map((item) => ({ id: item.id, name: item.name })),
      authors: authors.map((item) => ({ id: item.id, name: item.name })),
      status: rawStory.status === "Đang ra" ? "ongoing" : "full",
      cover: rawStory.thumbnail,
      thumbnail: rawStory.thumbnail,
      description: rawStory.description,
      created: new Date(),
      downvote: 0,
      upvote: 0,
      lastChapter: rawStory.chapters.length,
      title: rawStory.title,
      published: true,
      updated: new Date(),
      updatedBy: this.user.id,
      uploadBy: this.user.id,
      view: 0,
    };

    const savedStory = await this.saveStory(story);
    console.log(`Saved story ${savedStory.title}`);
    console.log(`Start saving ${rawStory.chapters.length} chapters...`);
    try {
      let chapterNo = 0;
      for (const rawChapter of rawStory.chapters) {
        if (!rawChapter.content) {
          throw new Error(`Chapter content is empty: ${savedStory.title} ---> ${rawChapter.fullTitle}`);
        }

        chapterNo++;

        await this.saveChapter({
          title: this.extractChapterTitle(rawChapter.title),
          content: rawChapter.content,
          published: true,
          updated: new Date(),
          storyId: savedStory.id,
          uploadBy: this.user.id,
          updatedBy: this.user.id,
          created: new Date(),
          chapterNo: chapterNo,
        });
      }
    } catch (e) {
      console.log(`An exception was thrown, do clean up!`);
      await this.storyModel.findByIdAndDelete(savedStory.id);
      throw e;
    }
    console.log(`Saved ${rawStory.chapters.length} chapters of ${savedStory.title}`);
  }

  private extractParts(raw: string): string[] {
    return (raw || "")
      .split(",")
      .filter(Boolean)
      .map((item) => item.trim());
  }

  private extractChapterTitle(fullTitle: string): string {
    return fullTitle ? fullTitle.substr(fullTitle.indexOf(":") + 1).trim() : "";
  }

  private extractRealChapterTitle(fullTitle: string): string {
    return fullTitle && fullTitle.indexOf(":") >= 0 ? fullTitle.substr(fullTitle.indexOf(":") + 1).trim() : "";
  }

  private extractChapterNo(fullTitle: string): string {
    return fullTitle ? fullTitle.substr(0, fullTitle.indexOf(":")).trim() || fullTitle.trim() : "";
  }
}