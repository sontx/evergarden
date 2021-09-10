import { GetStoryDto } from "@evergarden/shared";
import { GetStoryDtoEx } from "../components/StoryItem/index.api";

const TOP_BG_COLORS = ["#ed424b", "#f0643a", "#f0c53a", "#969ba3"];

export function decorateWithRanking(
  stories: GetStoryDto[] | undefined,
  limit?: number,
): GetStoryDtoEx[] | undefined {
  if (!stories) {
    return stories;
  }
  const actualLimit = limit === undefined ? stories.length : limit;
  return stories.map((story, index) => ({
    ...story,
    mark:
      index < actualLimit
        ? {
            text: `TOP ${index + 1}`,
            value: index + 1,
            backgroundColor: TOP_BG_COLORS[index]
              ? TOP_BG_COLORS[index]
              : TOP_BG_COLORS[TOP_BG_COLORS.length - 1],
            spotlight: index === 0,
          }
        : undefined,
  }));
}
