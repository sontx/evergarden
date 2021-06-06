import { Story } from "./story/story.entity";
import { IdType } from "@evergarden/shared";

export function delay(mills) {
  return new Promise((resolve) => setTimeout(() => resolve(null), mills));
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isOwnerOrGod(req, storyOrUploader: Story | IdType): boolean {
  const { id: userId, role } = req.user || {};
  const isOwner = (typeof storyOrUploader === "object" ? storyOrUploader.uploadBy : storyOrUploader) === userId;
  const isAdmin = role === "admin";
  return isOwner || isAdmin;
}
