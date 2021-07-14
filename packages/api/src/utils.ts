import { Story } from "./story/story.entity";

export function delay(mills) {
  return new Promise((resolve) => setTimeout(() => resolve(null), mills));
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isOwnerOrGod(req, storyOrUploader: Story | number): boolean {
  const { id: userId } = req.user || {};
  const isOwner = (typeof storyOrUploader === "object" ? storyOrUploader.createdBy : storyOrUploader) === userId;
  return isOwner || isGod(req);
}

export function isGod(req): boolean {
  const { role } = req.user || {};
  const isAdmin = role === "admin";
  const isMod = role === "mod";
  return isMod || isAdmin;
}
