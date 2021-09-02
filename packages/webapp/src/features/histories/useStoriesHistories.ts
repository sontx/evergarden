import { GetStoryDto } from "@evergarden/shared";
import { useAppSelector } from "../../app/hooks";
import { selectHistories } from "./historiesSlice";
import { useEffect, useState } from "react";

export function useStoriesHistories(stories: GetStoryDto[]) {
  const histories = useAppSelector(selectHistories);
  const [withHistories, setWithHistories] = useState<GetStoryDto[]>(stories);

  useEffect(() => {
    let changed = false;
    if (histories) {
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
    }
  }, [histories, stories]);

  return withHistories;
}
