import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { IStorySearchService } from "../interfaces/story-search.service";
import { StorySearchBody } from "@evergarden/shared";
import { StoryService } from "../../story/story.service";

const MAX_SEARCH_RESULTS = 50;

@Injectable()
export class LocalStorySearchService implements IStorySearchService {
  constructor(
    @Inject(forwardRef(() => StoryService))
    private storyService: StoryService,
  ) {}

  async search(text: string): Promise<StorySearchBody[]> {
    if (!text || text.trim().length === 0) {
      return [];
    }

    const found = await this.storyService.search(text, MAX_SEARCH_RESULTS);
    return found.map((story) => ({
      id: story.id,
      title: story.title,
      slug: story.slug,
      thumbnail: story.thumbnail,
      description: story.description,
    }));
  }

  initialize(): Promise<void> {
    return Promise.resolve();
  }
}
