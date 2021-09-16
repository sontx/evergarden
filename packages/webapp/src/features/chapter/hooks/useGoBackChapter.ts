import { useGoReading } from "../../../hooks/navigation/useGoReading";
import { useCallback } from "react";
import { GetChapterDto, GetStoryDto } from "@evergarden/shared";

export function useGoBackChapter() {
  const gotoReading = useGoReading();
  return useCallback(
    (story: string | GetStoryDto, chapter: GetChapterDto | number) => {
      const chapterNo =
        typeof chapter === "object" ? chapter.chapterNo : chapter;
      gotoReading(story, chapterNo - 1);
    },
    [gotoReading],
  );
}
