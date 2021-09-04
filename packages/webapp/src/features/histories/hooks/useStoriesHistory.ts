import { GetStoryDto } from "@evergarden/shared";
import { useEffect, useState } from "react";
import { useReadingHistory } from "./useReadingHistory";

export function useStoriesHistory(stories: GetStoryDto[] | undefined) {
  const { data: histories } = useReadingHistory();
  const [withHistories, setWithHistories] = useState<GetStoryDto[] | undefined>(
    stories,
  );

  useEffect(() => {
    let changed = false;
    if (histories && stories) {
      const newStories = stories.map((story) => {
        const found = histories.find((item) => item.storyId === story.id);
        if (found && found !== story.history) {
          changed = true;
          return {
            ...story,
            history: found,
          };
        }
        return story;
      });
      if (changed) {
        setWithHistories(newStories);
      }
    } else {
      setWithHistories(stories);
    }
  }, [histories, stories]);

  return withHistories;
}
