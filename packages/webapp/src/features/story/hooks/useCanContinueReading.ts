import { useEffect, useState } from "react";
import { GetStoryDto } from "@evergarden/shared";

export function useCanContinueReading(story: GetStoryDto | undefined) {
  const [canContinue, setCanContinue] = useState(false);
  useEffect(() => {
    setCanContinue(
      typeof story?.history?.currentChapterNo === "number" &&
        story.history.currentChapterNo > 0,
    );
  }, [story]);
  return canContinue;
}
