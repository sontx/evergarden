import { GetStoryDto } from "@evergarden/shared";
import { useAppSelector } from "../../app/hooks";
import { selectHistories } from "./historiesSlice";

export function useStoriesHistories(stories: GetStoryDto[]) {
  const histories = useAppSelector(selectHistories) || [];

  if (!stories) {
    return stories;
  }

  let changed = false;
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

  return changed ? newStories : stories;
}
