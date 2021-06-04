import { Story } from "./story/story.entity";

export function delay(mills) {
  return new Promise((resolve) => setTimeout(() => resolve(null), mills));
}

export function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

export function isOwnerOrGod(req, story: Story): boolean {
  const { id: userId, role } = req.user || {};
  const isOwner = story.uploadBy === userId;
  const isAdmin = role === "admin";
  return isOwner || isAdmin;
}
