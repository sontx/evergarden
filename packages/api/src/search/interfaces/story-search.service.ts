import { StorySearchBody } from "@evergarden/shared";

export const STORY_SEARCH_SERVICE_KEY = "StorySearchService";

export interface IStorySearchService {
  search(text: string): Promise<StorySearchBody[]>;
  initialize(): Promise<void>;
}
