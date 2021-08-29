import { GetStoryDto } from "@evergarden/shared";
import { useEffect, useState } from "react";
import { GetStoryDtoEx } from "../../../components/StoryItem/index.api";

const TOP_BG_COLORS = ["#ed424b", "#f0643a", "#f0c53a", "#969ba3"];

export function useStoriesWithMark(stories?: GetStoryDto[]) {
  const [data, setData] = useState<GetStoryDtoEx[]>();
  useEffect(() => {
    setData(
      stories
        ? stories.map((story, index) => ({
            ...story,
            mark: {
              text: `TOP ${index + 1}`,
              backgroundColor: TOP_BG_COLORS[index]
                ? TOP_BG_COLORS[index]
                : TOP_BG_COLORS[TOP_BG_COLORS.length - 1],
              spotlight: index === 0,
            },
          }))
        : undefined,
    );
  }, [stories]);
  return data;
}
