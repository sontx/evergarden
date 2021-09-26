import { BufferedFile } from "../file.model";

export type StoryUploadResult = {
  thumbnail: string;
  cover: string;
};

export const STORY_STORAGE_SERVICE_KEY = "StoryStorageService";

export interface IStoryStorageService {
  upload(file: BufferedFile, storyId: number): Promise<StoryUploadResult>;
  remove(storyId: number): Promise<void>;
}
