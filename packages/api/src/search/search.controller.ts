import { Controller, Get, Query } from "@nestjs/common";
import StorySearchService from "./story-search.service";
import { StorySearchBody } from "@evergarden/shared";
import { trimText } from "../../../webapp/src/utils/types";

@Controller("search")
export class SearchController {
  constructor(private storySearchService: StorySearchService) {}

  @Get("stories")
  async searchStories(@Query("query") query: string): Promise<StorySearchBody[]> {
    query = trimText(query);
    return query ? await this.storySearchService.search(query) : [];
  }
}
