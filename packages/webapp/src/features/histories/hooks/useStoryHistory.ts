import { GetStoryDto } from "@evergarden/shared";
import { useEffect, useState } from "react";
import { useReadingHistory } from "./useReadingHistory";

export function useStoryHistory<T extends GetStoryDto | undefined>(
  story: T,
): T {
  const { data: histories } = useReadingHistory();
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
    } else {
      setWithHistory(story);
    }
  }, [histories, story]);

  return withHistory;
}
