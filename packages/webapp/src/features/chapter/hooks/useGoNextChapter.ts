import { useGoReading } from "../../../hooks/navigation/useGoReading";
import { useCallback } from "react";
import { GetChapterDto, GetStoryDto } from "@evergarden/shared";

export function useGoNextChapter() {
  const gotoReading = useGoReading();
  return useCallback(
    (story: GetStoryDto, chapter: GetChapterDto) => {
      gotoReading(story, chapter.chapterNo + 1);
    },
    [gotoReading],
  );
}
