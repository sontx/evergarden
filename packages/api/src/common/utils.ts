import { Story } from "../story/story.entity";
import { GetChapterDto, GetStoryDto, PaginationOptions } from "@evergarden/shared";
import { Chapter } from "../chapter/chapter.entity";
import { Readable } from "stream";
import * as path from "path";
import * as fs from "fs";

export function delay(mills) {
  return new Promise((resolve) => setTimeout(() => resolve(null), mills));
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function useMicroservices() {
  return process.env.USE_MICROSERVIES === "true";
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

export async function writeFileAsync(
  filePath: string,
  data: string | Uint8Array,
  options?: (fs.BaseEncodingOptions & { mode?: fs.Mode; flag?: fs.OpenMode }) | BufferEncoding | null,
): Promise<void> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
  await fs.promises.writeFile(filePath, data, options);
}

export function getQuerySkip(options: PaginationOptions): number {
  const value = isFinite(options.skip) ? options.skip : options.page * options.limit;
  return isFinite(value) ? value : 0;
}

export async function forEachChunk<T>(arr: T[], limit: number, callback: (chunk: T[]) => Promise<void>) {
  let chunk: T[];
  for (const item of arr) {
    if (!chunk) {
      chunk = [];
    }
    chunk.push(item);
    if (chunk.length >= limit) {
      await callback(chunk);
      chunk = undefined;
    }
  }
  if (chunk) {
    await callback(chunk);
  }
}
