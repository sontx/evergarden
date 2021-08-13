import "reflect-metadata";
import { createConnection, EntityManager } from "typeorm";
import * as prompt from "prompt";
import * as fs from "fs";
import * as path from "path";
import { Story } from "../../packages/api/src/story/story.entity";
import { Genre } from "../../packages/api/src/genre/genre.entity";
import { Author } from "../../packages/api/src/author/author.entity";
import { stringToSlug } from "../../packages/shared/src";
import { Chapter } from "../../packages/api/src/chapter/chapter.entity";
import { User } from "../../packages/api/src/user/user.entity";

const syncGenres = async (manager: EntityManager, name: string) => {
  const genres = name.split(",");
  for (const genre of genres) {
    const name = genre.trim();
    const found = await manager.findOne(Genre, { name });
    if (!found) {
      const newGenre = new Genre();
      newGenre.name = name;
      await manager.save(newGenre);
    }
  }
};

const syncAuthors = async (manager: EntityManager, name: string) => {
  const authors = name.split(",");
  for (const author of authors) {
    const name = author.trim();
    const found = await manager.findOne(Author, { name });
    if (!found) {
      const newAuthor = new Author();
      newAuthor.name = name;
      await manager.save(newAuthor);
    }
  }
};
const saveChapter = async (
  manager: EntityManager,
  storyId: number,
  user: User,
  chapter,
  chapterNo: number
) => {
  const { fullTitle, url, content } = chapter;
  const title = extractRealChapterTitle(fullTitle);
  const newChapter = new Chapter();
  const now = new Date();
  newChapter.chapterNo = chapterNo;
  newChapter.title = title;
  newChapter.content = content;
  newChapter.published = true;
  newChapter.storyId = storyId;
  newChapter.created = now;
  newChapter.createdBy = user;
  newChapter.updated = now;
  newChapter.updatedBy = user;
  await manager.save(newChapter);
};

const extractRealChapterTitle = (fullTitle: string): string => {
  return fullTitle && fullTitle.indexOf(":") >= 0
    ? fullTitle.substr(fullTitle.indexOf(":") + 1).trim()
    : "";
};

function randomInt(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

createConnection()
  .then(async (connection) => {
    try {
      prompt.start();
      const result = await prompt.get(["path", "count", "maxChapters"]);
      const dirPath = result.path as string;
      const count = parseInt(result.count as string);
      const maxChapters = parseInt(result.maxChapters as string);

      console.log(`Importing from ${dirPath} with ${count} stories`);
      const files = fs.readdirSync(dirPath);
      const manager = connection.manager;
      const botUser = await manager.findOne(User, {
        role: "user",
        provider: "system",
        email: "bot",
      });
      if (!botUser) {
        console.log("Bot user was not found!");
        return;
      }

      let index = 0;
      let added = 0;
      do {
        const file = files[index++];
        const filePath = path.resolve(dirPath, file);
        const fileContent = fs.readFileSync(filePath, { encoding: "utf8" });

        let {
          title,
          thumbnail,
          authors,
          genres,
          genresL,
          status,
          description,
          chapters = [],
        } = JSON.parse(fileContent);

        const test = title.charAt(0);
        if (isFinite(test)) {
          console.log(`Skip ${file} because it title starts with a number`);
          continue;
        }

        chapters = chapters.filter(item => item.content);
        if (chapters.length === 0) {
          console.log(`Skip ${file} because it has no chapters`);
          continue;
        }

        const found = await manager.findOne(Story, { title });
        if (found) {
          console.log(`Skip ${file} because it already exists`);
          continue;
        }

        console.log(`Importing ${file}`);
        genres = genres || genresL || "";
        authors = authors || "";

        const actualMax = Math.min(chapters.length, maxChapters);
        const flexMax = randomInt(Math.min(actualMax, 10), actualMax);

        await syncGenres(manager, genres);
        await syncAuthors(manager, authors);
        const newStory = new Story();
        const now = new Date();
        newStory.title = title;
        newStory.thumbnail = thumbnail;
        newStory.cover = thumbnail;
        newStory.status = status === "Full" ? "full" : "ongoing";
        newStory.description = description;
        newStory.url = stringToSlug(title);
        newStory.created = now;
        newStory.createdBy = botUser;
        newStory.updated = now;
        newStory.updatedBy = botUser;
        newStory.lastChapter = flexMax;
        const savedStory = await manager.save(newStory);
        let i = 1;
        console.log(`${chapters.length} chapters`);
        for (let i = 0; i < flexMax; i++) {
          const chapter = chapters[i];
          await saveChapter(manager, savedStory.id, botUser, chapter, i++);
          console.log(`Done ${i} / ${chapters.length}`);
        }

        added++;
      } while (added < Math.min(files.length, count));
      console.log("DONE!");
    } finally {
      await connection.close();
    }
  })
  .catch((error) => console.log(error));
