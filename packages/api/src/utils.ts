import { Story } from "./story/story.entity";
import { GetChapterDto, GetStoryDto } from "@evergarden/shared";
import { Chapter } from "./chapter/chapter.entity";
import { Readable } from "stream";

export function delay(mills) {
  return new Promise((resolve) => setTimeout(() => resolve(null), mills));
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isOwnerOrGod(req, storyOrUploader: Story | GetStoryDto | GetChapterDto | Chapter | number): boolean {
  const { id: userId } = req.user || {};
  const isOwner = (typeof storyOrUploader === "object" ? storyOrUploader.createdBy.id : storyOrUploader) === userId;
  return isOwner || isGod(req);
}

export function isGod(req): boolean {
  const { role } = req.user || {};
  const isAdmin = role === "admin";
  const isMod = role === "mod";
  return isMod || isAdmin;
}

export function isNumber(st): boolean {
  return /^\d+$/.test(st);
}

export function toBuffer(stream: Readable): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const buff = [];
    stream.on("data", (chunk) => {
      buff.push(chunk);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buff));
    });
    stream.on("error", (err) => {
      reject(err);
    });
  });
}