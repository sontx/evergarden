import { GetStoryDto } from "@evergarden/shared";
import { useAppSelector } from "../../app/hooks";
import { selectHistories } from "./historiesSlice";
import { useEffect, useState } from "react";

export function useStoryHistory<T extends GetStoryDto | undefined>(
  story: T,
): T {
  const histories = useAppSelector(selectHistories);
  const [withHistory, setWithHistory] = useState<T>(story);

  useEffect(() => {
    if (histories && story) {
      const foundHistory = histories.find((item) => item.storyId === story.id);
      if (foundHistory !== story.history) {
        setWithHistory({
          ...story,
          history: foundHistory,
        });
      } else {
        setWithHistory(story);
      }
    }
  }, [histories, story]);

  return withHistory;
}
