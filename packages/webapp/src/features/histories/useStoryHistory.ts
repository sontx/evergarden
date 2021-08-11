import { GetStoryDto } from "@evergarden/shared";
import { useAppSelector } from "../../app/hooks";
import { selectHistories } from "./historiesSlice";

export function useStoryHistory<T extends (GetStoryDto | undefined)>(story: T): T {
  const histories = useAppSelector(selectHistories) || [];

  if (!story) {
    return story;
  }

  const foundHistory = histories.find((item) => item.storyId === story.id);
  if (foundHistory !== story.history) {
    return {
      ...story,
      history: foundHistory,
    };
  }

  return story;
}
